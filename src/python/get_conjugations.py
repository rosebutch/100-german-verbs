import requests
import json

def get_all_matches(search_body, search_str, page_word: str):
    matches = []
    while search_str in search_body:
        index = search_body.index(search_str)
        # Some really hacky html parsing follows
        next_word_start_index = index + len(search_str) + 2 # Find e.g. "INDIKATIV_PRAESENS_3P">stellen</span> and skip the ">
        next_word_end_index = search_body.index('<', next_word_start_index) # In the same sample, get 'stellen'
        matches.append(search_body[next_word_start_index:next_word_end_index])
        search_body = search_body[next_word_end_index:]
        # Some words can have extra pieces, e.g. stellen</span></span></td><td><span>vor</span></td></tr>
        # as compared to:                        machen</span></span></td></tr>
        # So again we're going to do something very hacky and check for whether we have that extra <td><span>...
        extra_word_string = "</span></span></td><td><span>"
        if search_body[:len(extra_word_string)] == extra_word_string:
            start_index = len(extra_word_string)
            end_index = search_body.index('<', start_index)
            extra_word = search_body[start_index:end_index]
            # Don't include extra word in situations like https://en.pons.com/verb-tables/german/stellen (stelle mich, stellst dich)
            # But do include in situations like https://en.pons.com/verb-tables/german/vorstellen (stelle vor, stellst vor)
            if extra_word in page_word:
                matches.append(extra_word)
            search_body = search_body[end_index:]
    return matches

match_words = ["INDIKATIV_PRAESENS_1S", "INDIKATIV_PRAESENS_2S", "INDIKATIV_PRAESENS_3S", "INDIKATIV_PRAESENS_1P", "INDIKATIV_PRAESENS_2P", "INDIKATIV_PRAESENS_3P"]
verbs_file = 'verb_list.txt'
out_file = 'words.json'
url='https://en.pons.com/verb-tables/german'
words = []
with open(verbs_file) as f:
    for line in f:
        word, definition = line.split(':')
        word = word.lstrip().rstrip()
        definition = definition.lstrip().rstrip()
        words.append({'word': word, 'translation': definition})

for word_dict in words:
    word = word_dict['word']
    print(f"Working on {word}...")
    conjugations = {}
    word_dict['conjugations'] = conjugations
    response = requests.get(f"{url}/{word}")
    if response.ok:
        html_text = response.text
        for match_word in match_words:
            matches = get_all_matches(html_text, match_word, word)
            match_key = match_word.split('_')[2]
            conjugations[match_key] = ' '.join(matches[1:])
    else:
        print(f"Bad response for '{word}'!")

with open(out_file, 'w') as o:
    json_str = json.dumps(words, ensure_ascii=False)
    o.write(json_str)




