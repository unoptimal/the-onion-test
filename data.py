import requests
import json

# client_id = '.....'
# client_secret = '....'

auth = requests.auth.HTTPBasicAuth(client_id, client_secret)
data = {'grant_type': 'password',
        'username': '......',  
        'password': '......'}  
headers = {'User-Agent': 'MyAPI/0.0.1'}
response = requests.post('https://www.reddit.com/api/v1/access_token', 
                         auth=auth, data=data, headers=headers)
TOKEN = response.json()['access_token']

headers['Authorization'] = f'bearer {TOKEN}'

subreddits = ['TheOnion', 'nottheonion']

for subreddit in subreddits:
    titles = set()
    after = None

    while len(titles) < 300:
        url = f'https://oauth.reddit.com/r/{subreddit}/top?limit=100&t=all'
        if after:
            url += f'&after={after}'
        response = requests.get(url, headers=headers)
        posts = response.json()['data']['children']
        after = response.json()['data']['after']

        for post in posts:
            if post['data']['title'][0] == '"' or post['data']['title'][0] == "'" or post['data']['title'][0] == " ":
                headline = post['data']['title'][1].upper() + post['data']['title'][2:]
            else:
                headline = post['data']['title'].lower().capitalize()
            
            source = post['data']['url']
            titles.add((headline, source))

        if not after:
            break

    titles = list(titles)[:300]

    with open(f'{subreddit}_titles.json', 'w') as f:
        json.dump(titles, f)