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

def extract_pattern_info(line):
    """Extract pattern and meaning from a line"""
    line_stripped = line.strip()
    
    # Find number at start
    num_match = re.match(r'^(\d+)[\.．]', line_stripped)
    if not num_match:
        return None
    
    pattern_id = int(num_match.group(1))
    rest = line_stripped[len(num_match.group(0)):].strip()
    rest = rest.lstrip('\u3000').strip()
    
    # Find first ～
    first_tilde = rest.find('～')
    if first_tilde == -1:
        return None
    
    # Find colon (full or half width)
    colon_pos = rest.find('：', first_tilde)
    if colon_pos == -1:
        colon_pos = rest.find(':', first_tilde)
    if colon_pos == -1:
        return None
    
    # Pattern is everything from first ～ to colon (excluding spaces before colon)
    pattern_part = rest[first_tilde:colon_pos].strip()
    
    # Find last ～ in pattern_part
    last_tilde = pattern_part.rfind('～')
    if last_tilde == -1:
        # No closing ～, use everything up to colon
        pattern_text = pattern_part
    else:
        # Get ～...～ part
        pattern_text = pattern_part[:last_tilde+1]
        # Check if there's text after last ～ but before colon (like parentheses)
        after_pattern = pattern_part[last_tilde+1:].strip()
        if after_pattern:
            # Include it in pattern
            pattern_text += ' ' + after_pattern
    
    # Meaning is everything after colon
    meaning = rest[colon_pos+1:].strip().lstrip('\u3000').strip()
    
    return {
        'id': pattern_id,
        'pattern': pattern_text,
        'meaning': meaning
    }

def find_all_patterns(lines):
    """Find all pattern headers"""
    patterns = []
    for i, line in enumerate(lines):
        line_stripped = line.strip()
        # Check if line starts with number + dot and contains pattern
        if re.match(r'^\d+[\.．]', line_stripped) and '～' in line_stripped and ('：' in line_stripped or ':' in line_stripped):
            info = extract_pattern_info(line_stripped)
            if info:
                patterns.append({
                    'line_num': i,
                    **info
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
    i = start_line + 1
    
    while i < end_line:
        line = lines[i].strip()
        
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
        
        if current_section == 'explanation':
            if pattern_data['explanation']:
                pattern_data['explanation'] += '\n' + line
            else:
                pattern_data['explanation'] = line
        elif current_section == 'examples':
            if (len(line) < 3 or 
                re.match(r'^\d+[\.\)]', line) or
                line in ['Ví dụ:', 'Ví vụ:', 'Giải thích:', 'Chú ý:']):
                i += 1
                continue
            
            if not is_japanese_text(line):
                vietnamese_text = line
                japanese_text = ''
                
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
    
    pattern_headers = find_all_patterns(lines)
    print(f'Found {len(pattern_headers)} pattern headers')
    
    grammar_patterns = []
    
    for idx, header in enumerate(pattern_headers):
        if idx + 1 < len(pattern_headers):
            end_line = pattern_headers[idx + 1]['line_num']
        else:
            end_line = len(lines)
        
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
    
    total_examples = sum(len(p.get('examples', [])) for p in patterns)
    patterns_with_notes = sum(1 for p in patterns if p.get('notes'))
    patterns_with_explanation = sum(1 for p in patterns if p.get('explanation'))
    print(f'Total examples: {total_examples}')
    print(f'Patterns with explanation: {patterns_with_explanation}')
    print(f'Patterns with notes: {patterns_with_notes}')
