import sys

def fix_ts_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace escaped backticks and escaped dollar signs
    content = content.replace('\\`', '`').replace('\\$', '$')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_ts_file('generate_schema_and_seed.ts')
