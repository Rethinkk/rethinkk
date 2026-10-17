"""Retrieve the selected public sources without bypassing access controls."""
import argparse,concurrent.futures,datetime,hashlib,json,subprocess,urllib.request
from html.parser import HTMLParser
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('sources',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
if any(args.output.iterdir()):parser.error('Use a new empty output directory; retained research evidence must not be overwritten.')
class PlainText(HTMLParser):
 def __init__(self):super().__init__();self.parts=[];self.skip=0
 def handle_starttag(self,t,a):
  if t in ('script','style'):self.skip+=1
 def handle_endtag(self,t):
  if t in ('script','style'):self.skip=max(0,self.skip-1)
 def handle_data(self,s):
  if not self.skip and s.strip():self.parts.append(s.strip())
def fetch(row):
 id,leader,url=row;r=dict(id=id,leader_id=leader,requested_url=url,retrieved_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'RETHINKK research source verification'}),timeout=30) as response:
   body=response.read(25*1024*1024);r.update(http_status=response.status,final_url=response.url,content_type=response.headers.get('Content-Type'),bytes=len(body),sha256=hashlib.sha256(body).hexdigest())
  name=id+('.pdf' if body.startswith(b'%PDF') else '.html');p=args.output/name;p.write_bytes(body);r['snapshot_file']=name
  textpath=args.output/(id+'.txt')
  if body.startswith(b'%PDF'):subprocess.run(['pdftotext','-layout',str(p),str(textpath)],check=True,capture_output=True)
  else:
   parsed=PlainText();parsed.feed(body.decode('utf-8',errors='replace'));textpath.write_text('\n'.join(parsed.parts))
  r.update(text_file=textpath.name,text_sha256=hashlib.sha256(textpath.read_bytes()).hexdigest())
 except Exception as e:r.update(http_status=getattr(e,'code',None),error=str(e))
 return r
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:rows=list(pool.map(fetch,json.loads(args.sources.read_text())))
(args.output/'retrieval-manifest.json').write_text(json.dumps(rows,indent=2)+'\n')
for r in rows:print(r['id'],r.get('http_status'),r.get('bytes'),r.get('error',''))
