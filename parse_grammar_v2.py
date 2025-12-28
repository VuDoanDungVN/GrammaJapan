#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def is_japanese_text(text):
    """Check if text is Japanese"""
    if not text or len(text.strip()) < 2:
        return False
    text_clean = text.strip()
    japanese_pattern = re.compile(r'[あ-んア-ンー～。、！？]')
    matches = japanese_pattern.findall(text_clean)
    return len(matches) > len(text_clean) * 0.6 and len(text_clean) > 2

def find_all_patterns(lines):
    """Find all pattern headers and their line numbers"""
    patterns = []
    for i, line in enumerate(lines):
        line_stripped = line.strip()
        match = re.match(r'^(\d+)[\.．]\s*(～[^：:]+～)[：:]\s*(.+)$', line_stripped)
        if match:
            patterns.append({
                'line_num': i,
                'id': int(match.group(1)),
                'pattern': match.group(2).strip(),
                'meaning': match.group(3).strip()
            })
    return patterns

def parse_pattern(lines, start_line, end_line):
    """Parse a single pattern from start_line to end_line"""
    pattern_data = {
        'explanation': '',
        'examples': [],
        'notes': ''
    }
    
    current_section = None
    i = start_line + 1  # Start after the header line
    
    while i < end_line:
        line = lines[i].strip()
        
        # Check for section headers
        if line == 'Giải thích:':
            current_section = 'explanation'
            i += 1
            continue
        elif line in ['Ví dụ:', 'Ví vụ:']:
            current_section = 'examples'
            i += 1
            continue
        elif line == 'Chú ý:':
            current_section = 'notes'
            i += 1
            continue
        
        if not line:
            i += 1
            continue
        
        # Process content
        if current_section == 'explanation':
            if pattern_data['explanation']:
                pattern_data['explanation'] += '\n' + line
            else:
                pattern_data['explanation'] = line
        elif current_section == 'examples':
            # Skip short lines, numbered items, section headers
            if (len(line) < 3 or 
                re.match(r'^\d+[\.\)]', line) or
                line in ['Ví dụ:', 'Ví vụ:', 'Giải thích:', 'Chú ý:']):
                i += 1
                continue
            
            # Check if Vietnamese
            if not is_japanese_text(line):
                vietnamese_text = line
                japanese_text = ''
                
                # Check next line
                if i + 1 < end_line:
                    next_line = lines[i + 1].strip()
                    if next_line and is_japanese_text(next_line):
                        japanese_text = next_line
                        i += 1
                
                pattern_data['examples'].append({
                    'vietnamese': vietnamese_text,
                    'japanese': japanese_text
                })
        elif current_section == 'notes':
            pattern_data['notes'] += ('\n' if pattern_data['notes'] else '') + line
        elif not current_section:
            # No section header yet - might be explanation without header
            if not is_japanese_text(line) and len(line) > 10:
                if pattern_data['explanation']:
                    pattern_data['explanation'] += '\n' + line
                else:
                    pattern_data['explanation'] = line
        
        i += 1
    
    return pattern_data

def parse_grammar_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = [line.rstrip('\n\r') for line in f.readlines()]
    
    # Find all pattern headers
    pattern_headers = find_all_patterns(lines)
    print(f'Found {len(pattern_headers)} pattern headers')
    
    grammar_patterns = []
    
    for idx, header in enumerate(pattern_headers):
        # Determine end line (start of next pattern or end of file)
        if idx + 1 < len(pattern_headers):
            end_line = pattern_headers[idx + 1]['line_num']
        else:
            end_line = len(lines)
        
        # Parse this pattern
        pattern_data = parse_pattern(lines, header['line_num'], end_line)
        
        grammar_patterns.append({
            'id': header['id'],
            'pattern': header['pattern'],
            'meaning': header['meaning'],
            'explanation': pattern_data['explanation'],
            'examples': pattern_data['examples'],
            'notes': pattern_data['notes']
        })
    
    return grammar_patterns

if __name__ == '__main__':
    patterns = parse_grammar_file('gramman2.md')
    
    with open('src/data/grammar.json', 'w', encoding='utf-8') as f:
        json.dump(patterns, f, ensure_ascii=False, indent=2)
    
    print(f'\nParsed {len(patterns)} grammar patterns')
    print(f'Saved to src/data/grammar.json')
    
    # Show stats
    total_examples = sum(len(p.get('examples', [])) for p in patterns)
    patterns_with_notes = sum(1 for p in patterns if p.get('notes'))
    patterns_with_explanation = sum(1 for p in patterns if p.get('explanation'))
    print(f'Total examples: {total_examples}')
    print(f'Patterns with explanation: {patterns_with_explanation}')
    print(f'Patterns with notes: {patterns_with_notes}')


