import csv,json,hashlib,datetime,collections,re,os
from pathlib import Path
p=Path(__file__).parent
latest=list(csv.DictReader((p/'HS119_members.csv').open()))
allrows=list(csv.DictReader((p/'HSall_members.csv').open()))
party={'100':'Democratic','200':'Republican','328':'Independent'}
def number(v):
 return float(v) if v else None
def count(v):
 return int(v) if v else None
def name(v):
 last,sep,first=v.partition(', ')
 # Preserve given names; uppercase source surnames are display-title-cased.
 return (first+' '+last.title()).strip() if sep else v

def code(v):
 n=float(v)
 assert n.is_integer(),v
 return str(int(n))
def record(r):
 return {'congress':int(r['congress']),'chamber':r['chamber'].lower(),'party':party.get(code(r['party_code']), 'Party code '+code(r['party_code'])),'icpsr':code(r['icpsr']),'nominate':number(r['nominate_dim1']),'nokkenPoole':number(r['nokken_poole_dim1']),'votes':count(r['nominate_number_of_votes']),'conditional':None if not r['conditional'] else code(r['conditional'])=='1'}
history=collections.defaultdict(list)
for r in allrows:
 if r['chamber'] in ('House','Senate') and r['bioguide_id']:
  history[r['bioguide_id']].append(record(r))
people=[]
for r in latest:
 if r['chamber'] not in ('House','Senate'):continue
 bio=r['bioguide_id']; icpsr=r['icpsr']
 assert re.fullmatch(r'[A-Z]\d{6}',bio)
 person={**record(r),'id':bio+'-'+icpsr,'bioguideId':bio,'name':name(r['bioname']),'sourceName':r['bioname'],'state':r['state_abbrev'],'district':int(r['district_code']),'sourceUrl':f'https://voteview.com/person/{icpsr}','bioguideUrl':f'https://bioguide.congress.gov/search/bio/{bio}','history':sorted(history[bio],key=lambda x:(x['congress'],x['chamber'],x['icpsr']))}
 people.append(person)
people.sort(key=lambda x:x['name'])
assert len({r['id'] for r in people})==len(people)
for r in people:
 for x in [r]+r['history']:
  for k in ['nominate','nokkenPoole']:
   assert x[k] is None or -1 <= x[k] <= 1
  assert x['votes'] is None or x['votes']>=0
out={'metadata':{'provider':'Voteview','sourceLastModified':{'HS119_members.csv':os.environ.get('VOTEVIEW_CURRENT_LAST_MODIFIED','Not recorded'),'HSall_members.csv':os.environ.get('VOTEVIEW_HISTORY_LAST_MODIFIED','Not recorded')},'snapshotDate':datetime.datetime.now(datetime.timezone.utc).date().isoformat(),'congress':119,'citation':'Lewis, Jeffrey B., Keith Poole, Howard Rosenthal, Adam Boche, Aaron Rudkin, and Luke Sonnet (2026). Voteview: Congressional Roll-Call Votes Database. https://voteview.com/','sourceUrl':'https://voteview.com/static/data/out/members/HS119_members.csv','historySourceUrl':'https://voteview.com/static/data/out/members/HSall_members.csv','methodologyUrl':'https://voteview.com/articles/data_help_members','aboutUrl':'https://voteview.com/about','sha256':{n:hashlib.sha256((p/n).read_bytes()).hexdigest() for n in ['HS119_members.csv','HSall_members.csv']},'coverage':'House and Senate member records appearing in the 119th Congress export; not a verified currently-serving roster. Party-changing members can have more than one record.','rowCount':len(people),'uniquePeople':len({r['bioguideId'] for r in people})},'politicians':people}
(p/'politicians.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))+'\n')
print(json.dumps({'profiles':len(people),'uniquePeople':out['metadata']['uniquePeople'],'historyRows':sum(len(r['history']) for r in people),'bytes':(p/'politicians.json').stat().st_size,'missingNominate':sum(r['nominate'] is None for r in people),'missingVotes':sum(r['votes'] is None for r in people),'IL':sum(r['state']=='IL' for r in people)}))
