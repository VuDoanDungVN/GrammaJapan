#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def is_japanese_text(text):
    """Check if text is Japanese"""
    if not text or len(text.strip()) < 2:
        return False
    text_clean = text.strip()
    # Check if it's mostly Japanese characters (hiragana, katakana, kanji)
    japanese_pattern = re.compile(r'[あ-んア-ンー～。、！？\s]')
    matches = japanese_pattern.findall(text_clean)
    # If more than 70% are Japanese characters, consider it Japanese
    return len(matches) > len(text_clean) * 0.7 and len(text_clean) > 2

def parse_grammar_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = [line.rstrip('\n\r') for line in f.readlines()]
    
    grammar_patterns = []
    current_pattern = None
    current_section = None
    current_examples = []
    current_notes = []
    pattern_id = 0
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines at start
        if not line and not current_pattern:
            i += 1
            continue
        
        # Check if this is a pattern header: "1. ～ことにする～：　..." or "2．～ばいいのに～：　..."
        pattern_match = re.match(r'^(\d+)[\.．]\s*(～[^：:]+～)[：:]\s*(.+)$', line)
        if pattern_match:
            # Save previous pattern
            if current_pattern:
                if current_examples:
                    current_pattern['examples'] = current_examples
                if current_notes:
                    current_pattern['notes'] = '\n'.join(current_notes)
                grammar_patterns.append(current_pattern)
            
            # Start new pattern
            pattern_id += 1
            current_pattern = {
                'id': pattern_id,
                'pattern': pattern_match.group(2).strip(),
                'meaning': pattern_match.group(3).strip(),
                'explanation': '',
                'examples': [],
                'notes': ''
            }
            current_section = None
            current_examples = []
            current_notes = []
            i += 1
            continue
        
        # Check for section headers
        if line == 'Giải thích:' and current_pattern:
            current_section = 'explanation'
            i += 1
            continue
        
        if line in ['Ví dụ:', 'Ví vụ:'] and current_pattern:
            current_section = 'examples'
            i += 1
            continue
        
        if line == 'Chú ý:' and current_pattern:
            current_section = 'notes'
            i += 1
            continue
        
        # Process content only if we have a current pattern
        if not current_pattern:
            i += 1
            continue
        
        if not line:
            i += 1
            continue
        
        # If we hit a new pattern header (without saving), it means we missed something
        # But we already check for pattern headers above, so this shouldn't happen
        
        if current_section == 'explanation':
            if current_pattern['explanation']:
                current_pattern['explanation'] += '\n' + line
            else:
                current_pattern['explanation'] = line
        elif current_section == 'examples':
            # Skip very short lines, numbered items, and section headers
            if (len(line) < 3 or 
                re.match(r'^\d+[\.\)]', line) or
                line in ['Ví dụ:', 'Ví vụ:', 'Giải thích:', 'Chú ý:']):
                i += 1
                continue
            
            # Check if this is Vietnamese (not Japanese)
            if not is_japanese_text(line):
                vietnamese_text = line
                japanese_text = ''
                
                # Check next line for Japanese
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    if next_line and is_japanese_text(next_line):
                        japanese_text = next_line
                        i += 1  # Skip the Japanese line
                
                current_examples.append({
                    'vietnamese': vietnamese_text,
                    'japanese': japanese_text
                })
        elif current_section == 'notes':
            current_notes.append(line)
        elif not current_section:
            # No section yet, but we have content - this might be explanation without header
            # Some patterns don't have "Giải thích:" header
            if not is_japanese_text(line) and len(line) > 10:
                # Likely explanation text
                if current_pattern['explanation']:
                    current_pattern['explanation'] += '\n' + line
                else:
                    current_pattern['explanation'] = line
                    current_section = 'explanation'  # Set section implicitly
        
        i += 1
    
    # Save last pattern
    if current_pattern:
        if current_examples:
            current_pattern['examples'] = current_examples
        if current_notes:
            current_pattern['notes'] = '\n'.join(current_notes)
        grammar_patterns.append(current_pattern)
    
    return grammar_patterns

if __name__ == '__main__':
    patterns = parse_grammar_file('gramman2.md')
    
    with open('src/data/grammar.json', 'w', encoding='utf-8') as f:
        json.dump(patterns, f, ensure_ascii=False, indent=2)
    
    print(f'Parsed {len(patterns)} grammar patterns')
    print(f'Saved to src/data/grammar.json')
    
    # Show stats
    total_examples = sum(len(p.get('examples', [])) for p in patterns)
    patterns_with_notes = sum(1 for p in patterns if p.get('notes'))
    patterns_with_explanation = sum(1 for p in patterns if p.get('explanation'))
    print(f'Total examples: {total_examples}')
    print(f'Patterns with explanation: {patterns_with_explanation}')
    print(f'Patterns with notes: {patterns_with_notes}')
    
    # Show first and last pattern IDs
    if patterns:
        print(f'First pattern: #{patterns[0]["id"]} - {patterns[0]["pattern"]}')
        print(f'Last pattern: #{patterns[-1]["id"]} - {patterns[-1]["pattern"]}')
