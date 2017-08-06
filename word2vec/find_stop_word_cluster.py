# load stopwords set
import json
from pprint import pprint 
stopwordset = set()
with open('dicts/stopwords_by_hand.txt', 'r', encoding='utf-8') as sw:
    for line in sw:
        stopwordset.add(line.strip('\n'))

with open('cluster.json') as infine:
    f = json.load(infine)

result = {}

for stopword in stopwordset:
    for cluster in f:
        for word_inside in cluster:
            if stopword == word_inside:
                if str(f.index(cluster)) in result:
                    result[str(f.index(cluster))] += 1
                else:
                    result[str(f.index(cluster))] = 1

pprint(result)

# def find_cluster(target,clusters):
#     for c in clusters:
#         if target in c:
#             print(c)