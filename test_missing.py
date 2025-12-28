#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import sys

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open('gramman2.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Test missing IDs
missing_ids = [19, 26, 42, 48, 61, 71, 73, 78, 79, 80, 93, 101, 112]

for missing_id in missing_ids[:5]:  # Test first 5
    # Find line with this ID
    for i, line in enumerate(lines, 1):
        line_stripped = line.strip()
        if re.match(rf'^{missing_id}[\.．]', line_stripped) and '～' in line_stripped:
            print(f'\nID {missing_id} - Line {i}:')
            print(f'  Text: {line_stripped[:80]}')
            print(f'  Repr: {repr(line_stripped[:100])}')
            
            # Try pattern
            match = re.match(r'^(\d+)[\.．]\s*(.*?)(～[^：:]+～.*?)[\s\u3000]*[：:][\s\u3000]*(.+)$', line_stripped)
            print(f'  Match: {match is not None}')
            if not match:
                # Try simpler pattern
                match2 = re.match(r'^(\d+)[\.．]\s*(～[^：:]+～)[\s\u3000]*[：:][\s\u3000]*(.+)$', line_stripped)
                print(f'  Simple match: {match2 is not None}')
                if match2:
                    print(f'  Groups: {match2.groups()}')
            break


