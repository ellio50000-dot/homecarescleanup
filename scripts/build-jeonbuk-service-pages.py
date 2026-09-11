"""Build additive, crawlable service guides. No external packages required."""
from pathlib import Path
from html import escape as e
import json
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'jeonbuk-services'
BASE = 'https://homecarescleanup.com'
PREFIX = '/jeonbuk-services/'
CITIES = [('jeonju','전주시'),('iksan','익산시'),('gunsan','군산시'),('gimje','김제시'),('namwon','남원시'),('jeongeup','정읍시'),('wanju','완주군'),('buan','부안군'),('gochang','고창군'),('sunchang','순창군'),('imsil','임실군'),('jinan','진안군'),('muju','무주군'),('jangsu','장수군')]
AREAS = ' · '.join(name for _, name in CITIES)
# Each product gets its own consultation criteria, rather than city-name copies.
PRODUCTS = [
 ('aircon','에어컨 청소','벽걸이·스탠드·창문형·시스템에어컨',
  '에어컨 청소는 설치 형태와 모델에 따라 분해 범위가 달라집니다. 상담 시 실내기 전체 모습과 모델명 사진을 보내주시면 제품 유형에 맞춰 작업 가능 여부를 안내합니다.',
  ['실내기 형식과 제조사·모델명','에어컨 수량과 설치 높이','냄새·먼지 등 불편한 점과 최근 청소 시기'],
  '투인원 제품도 상담할 수 있나요?','네. 스탠드와 벽걸이 각각의 모델과 설치 사진을 보내주세요. 두 실내기의 작업 범위와 견적을 함께 안내합니다.'),
 ('wall-aircon','벽걸이에어컨 청소','가정·원룸·사무실 벽걸이형 에어컨',
  '벽걸이에어컨은 벽과 천장 사이의 여유 공간, 모델별 송풍팬 구조에 따라 작업 방법이 달라집니다. 필터만 청소할지 내부 분해청소가 필요한지 상담 때 구분해 드립니다.',
  ['모델명 라벨과 실내기 전면 사진','천장·가구와 실내기 사이의 간격','냄새 발생 시점과 누수 여부'],
  '송풍팬까지 분해하나요?','모든 모델에 동일한 분해 방법을 적용할 수는 없습니다. 모델과 설치 상태를 확인한 뒤 가능한 분해 범위를 안내합니다.'),
 ('stand-aircon','스탠드에어컨 청소','스탠드형·투인원 구성의 스탠드 실내기',
  '스탠드에어컨 청소는 전면 패널, 송풍부, 열교환기 등 모델별 구조를 확인하는 것부터 시작합니다. 원형 토출구 모델과 일반형은 부품 구조가 달라 모델명을 먼저 확인합니다.',
  ['전면 전체 사진과 모델명','투인원 여부와 함께 청소할 벽걸이 유무','에어컨 주변 작업 공간'],
  '투인원 청소와 스탠드 청소는 같은 견적인가요?','투인원은 스탠드와 벽걸이의 두 실내기를 포함하는지에 따라 범위가 달라집니다. 상담 시 청소할 실내기 수를 알려주세요.'),
 ('window-aircon','창문형에어컨 청소','창문 설치형 에어컨',
  '창문형에어컨은 창틀과 고정 장치, 제품 무게를 함께 살펴야 합니다. 설치된 모습과 모델명을 확인해 제품 탈거 필요 여부 및 가능한 청소 범위를 안내합니다.',
  ['제조사·모델명','창틀 고정 부위와 제품 전체 사진','설치 층수 및 실내 작업 공간'],
  '창문에서 제품을 내려야 하나요?','필요한 분해 범위와 설치 구조에 따라 다릅니다. 탈거·재설치가 필요한지, 해당 작업이 견적에 포함되는지를 예약 전에 확인해 주세요.'),
 ('system-aircon','시스템에어컨 청소','천장형 1WAY·2WAY·4WAY·원형 시스템에어컨',
  '시스템에어컨은 토출구 형태와 천장 높이, 설치 대수에 따라 준비와 작업 범위가 달라집니다. 가정·매장·사무실 등 현장 조건을 확인한 뒤 방문 일정을 협의합니다.',
  ['1WAY·2WAY·4WAY·원형 등 제품 형태','천장 높이와 설치 대수','영업 중 작업 가능 여부와 희망 시간'],
  '여러 대를 한 번에 청소할 수 있나요?','설치 대수와 현장 여건에 맞춰 가능 일정을 상담합니다. 사진과 수량을 보내주시면 작업 범위와 견적을 안내합니다.'),
 ('top-load-washer','통돌이세탁기 분해청소','일반 통돌이·전자동 세탁기',
  '통돌이세탁기 분해청소는 세탁조와 회전판 등의 오염 상태 및 분해 가능 여부를 확인해 진행 범위를 정합니다. 노후 상태나 부품 고착에 따라 분해가 제한될 수 있습니다.',
  ['제조사·모델명과 용량','세탁기 위쪽 및 주변 여유 공간','이물·냄새 등 증상과 사용 연수'],
  '모든 통돌이세탁기의 세탁조를 꺼낼 수 있나요?','제품 구조, 부품 고착과 노후 상태에 따라 다릅니다. 모델 확인 후 범위를 안내하며 현장 상태에 따라 작업 내용이 달라질 수 있습니다.'),
 ('drum-washer','드럼세탁기 분해청소','드럼세탁기·워시타워의 세탁기',
  '드럼세탁기는 용량, 설치 형태와 건조기 적층 여부에 따라 접근 가능한 부품이 달라집니다. 워시타워나 건조기와 함께 설치한 제품은 전체 설치 사진을 보내주시면 상담에 도움이 됩니다.',
  ['모델명과 세탁 용량','단독·적층·워시타워 설치 여부','도어 앞과 제품 옆쪽의 여유 공간'],
  '워시타워도 상담할 수 있나요?','네. 세탁기와 건조기 모델명, 전체 설치 사진을 보내주세요. 분리 작업 필요 여부와 가능한 청소 범위를 확인해 안내합니다.'),
 ('dryer','건조기 분해청소','전기식·히트펌프식 의류건조기',
  '건조기는 필터 청소와 내부 분해청소의 범위가 다릅니다. 모델별 열교환기 구조와 설치 형태를 확인해 내부 먼지·보풀 청소 상담을 진행합니다.',
  ['모델명과 전기식·가스식 구분','단독·적층 설치 여부','건조 시간 증가·냄새 등 증상'],
  '필터 청소만 하면 내부 청소도 된 건가요?','필터 관리와 내부 분해청소는 대상 부위가 다릅니다. 모델별로 접근 가능한 내부 부위와 청소 범위를 상담 때 확인해 주세요.'),
 ('gas-dryer','가스건조기 청소','가스식 의류건조기',
  '가스건조기는 전기식 건조기와 구분해 상담합니다. 제조사·모델명, 배기 방식과 설치 사진을 확인한 뒤 청소 가능 여부 및 작업 범위를 안내합니다. 가스 배관 분리·연결이나 연소부 수리까지 청소에 포함되는 것은 아닙니다.',
  ['가스식 여부와 제조사·모델명','제품 전체와 배기구·배관 주변 사진','청소 요청 부위 및 고장·오류 표시 여부'],
  '가스 배관 작업도 포함되나요?','청소 상담만으로 가스 배관 작업이 포함된다고 볼 수 없습니다. 배관 분리·연결 등이 필요한 경우 해당 작업 가능 여부와 별도 전문 작업 필요성을 먼저 확인합니다.'),
 ('air-purifier','공기청정기 청소','일반형·타워형·2단 공기청정기',
  '공기청정기는 필터 교체와 내부 청소를 구분해 상담합니다. 1단·2단 구조와 모델명을 확인하고 커버, 송풍부 등 청소할 부위와 필터 교체 필요 여부를 안내합니다.',
  ['제조사·모델명과 1단·2단 구분','제품 수량과 필터 관리 상태','먼지·냄새 등 불편한 점'],
  '필터 교체 비용도 청소비에 포함되나요?','필터 교체와 본체 내부 청소는 별도 항목일 수 있습니다. 견적 상담에서 포함 여부와 교체용 필터 준비 방법을 확인해 주세요.'),
 ('dehumidifier','제습기 청소','가정용·대용량 제습기',
  '제습기는 물통 청소와 제품 내부 청소의 범위를 구분해야 합니다. 모델명과 제품 상태를 확인해 물통, 필터, 내부 오염 등 요청하신 부위의 청소 가능 여부를 안내합니다.',
  ['제조사·모델명과 제습 용량','물통·연속배수 사용 방식','냄새·먼지·오류 등 현재 상태'],
  '냄새가 나면 청소만으로 해결되나요?','오염 외에도 여러 원인이 있을 수 있어 해결을 단정하지 않습니다. 발생 상황과 제품 상태를 확인하고 청소 범위를 상담합니다.'),
 ('refrigerator','냉장고 청소','일반형·양문형·4도어·원룸 냉장고',
  '냉장고 청소는 보관실, 선반, 서랍, 도어 패킹 등 요청 부위를 확인해 범위를 정합니다. 식품 보관 공간과 기계실은 작업 조건이 다르므로 기계실 청소 요청은 별도로 알려주세요.',
  ['냉장고 형태·용량·모델명','식품을 비울 수 있는지와 작업 공간','보관실·패킹·기계실 등 요청 부위'],
  '청소 전에 음식물을 비워야 하나요?','청소할 보관실의 식품을 옮겨둘 준비가 필요합니다. 비워둘 범위와 작업 전 준비사항은 예약 상담에서 안내받으실 수 있습니다.'),
]

CSS = '''*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:system-ui,-apple-system,"Malgun Gothic",sans-serif;color:#172b49;background:#f4f7fc;font-size:17px;line-height:1.75}a{color:#1155ae;text-underline-offset:.2em}a:focus-visible,summary:focus-visible{outline:3px solid #ef9b00;outline-offset:5px}header,main,footer{max-width:1040px;margin:auto;padding:24px}header{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}header a{font-weight:750}h1{font-size:clamp(1.9rem,5vw,2.8rem);line-height:1.3;letter-spacing:-.035em}h2{font-size:1.5rem;line-height:1.4;margin-top:0}h3{font-size:1.15rem}section{background:white;border:1px solid #d8e3f3;border-radius:16px;padding:28px;margin:24px 0}.lead{background:#092e63;color:white;border:0}.lead a{color:white}.eyebrow{font-size:.9rem;font-weight:650;color:#9bc7ff}.calls{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.calls a{display:block;padding:12px 18px;border-radius:10px;text-decoration:none;background:#145cc3;color:#fff;font-weight:750}.calls a:last-child{background:#ffcc52;color:#172b49}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:14px}.card{display:block;border:1px solid #d8e3f3;border-radius:10px;padding:18px;background:#f7faff;text-decoration:none}.card strong{display:block;font-size:1.1rem}.card span{color:#4a5d75;font-size:.95rem}.areas{display:flex;gap:10px;flex-wrap:wrap}.areas a{padding:6px 12px;background:#eaf2ff;border-radius:8px}details{border-bottom:1px solid #d8e3f3;padding:15px 0}summary{cursor:pointer;font-weight:700}details p{margin-bottom:4px}.note{color:#526580;font-size:.95rem}footer{padding-bottom:40px}ul,ol{padding-left:1.5em}li{margin:8px 0}section[id]{scroll-margin-top:20px}@media(max-width:600px){header,main,footer{padding:16px}section{padding:20px}.calls{display:grid;grid-template-columns:1fr}.cards{grid-template-columns:1fr}}'''
OUT.mkdir(parents=True,exist_ok=True)
(OUT/'styles.css').write_text(CSS)
ORG = {'@type':'Organization','@id':BASE+'/#organization','name':'홈케어스 클린업','alternateName':'홈케어스클린업','url':BASE+'/','telephone':'1577-7931','contactPoint':[{'@type':'ContactPoint','telephone':'1577-7931','contactType':'대표전화','availableLanguage':'Korean'},{'@type':'ContactPoint','telephone':'+82-10-5005-1078','contactType':'예약문의상담','availableLanguage':'Korean'}],'areaServed':[{'@type':'AdministrativeArea','name':name} for _,name in CITIES]}

def case_links(product=None):
 cases=json.loads((ROOT/'data'/'naver-work-cases.json').read_text())
 published=[]
 for c in cases:
  if not c.get('verified') or not c.get('url'): continue
  u=urlparse(c['url'])
  if u.scheme!='https' or u.hostname not in ('blog.naver.com','m.blog.naver.com'):
   raise ValueError('Case URL must be a verified Naver blog article')
  if not (u.path.startswith('/turbo1987/') or ('blogId=turbo1987' in u.query and 'logNo=' in u.query)):
   raise ValueError('Case URL must identify an article in the established business blog')
  if product is None or c['product']==product: published.append(c)
 if not published: return ''
 return '<section><h2>지역별 실제 작업사례</h2><div class="cards">'+''.join(f'<a class="card" href="{e(c["url"],quote=True)}"><strong>{e(c["title"])}</strong><span>{e(c["summary"])} · 네이버 블로그에서 보기</span></a>' for c in published)+'</div></section>'

def calls():
 return '<div class="calls"><a href="tel:15777931">대표전화 1577-7931</a><a href="tel:01050051078">예약문의상담 010-5005-1078</a></div>'
def product_cards():
 return '<div class="cards">'+''.join(f'<a class="card" href="{PREFIX}{slug}/"><strong>{e(name)}</strong><span>{e(types)}</span></a>' for slug,name,types,*_ in PRODUCTS)+'</div>'
def areas():
 return '<p>'+e(AREAS)+'</p><p>전북특별자치도 14개 시·군을 대상으로 방문 청소를 상담합니다. 읍·면 지역을 포함한 정확한 주소, 제품 모델, 희망 일정을 알려주시면 방문 가능 일정과 출장비 포함 견적을 안내합니다.</p>'
def faq_html(qas):
 return '<section><h2>자주 묻는 질문</h2>'+''.join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q,a in qas)+'</section>'
def render(slug,title,desc,body,service=None):
 url=BASE+PREFIX+(slug+'/' if slug else '')
 graph=[ORG,{'@type':'WebPage','@id':url+'#webpage','url':url,'name':title,'description':desc,'inLanguage':'ko-KR','about':{'@id':ORG['@id']}}]
 if service: graph.append({'@type':'Service','@id':url+'#service','name':'전북 '+service,'serviceType':service,'provider':{'@id':ORG['@id']},'areaServed':ORG['areaServed'],'url':url})
 out=OUT/slug if slug else OUT
 out.mkdir(parents=True,exist_ok=True)
 text=f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)}</title><meta name="description" content="{e(desc,quote=True)}"><meta name="robots" content="index,follow"><link rel="canonical" href="{url}"><meta property="og:type" content="website"><meta property="og:title" content="{e(title,quote=True)}"><meta property="og:description" content="{e(desc,quote=True)}"><meta property="og:url" content="{url}"><link rel="stylesheet" href="{PREFIX}styles.css"><script type="application/ld+json">{json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False)}</script></head>
<body><header><a href="/">홈케어스 클린업</a><a href="{PREFIX}">전북 지역·제품별 청소 안내</a></header><main>{body}</main><footer><strong>홈케어스 클린업</strong><p>대표전화 1577-7931 · 예약문의상담 010-5005-1078</p><a href="/">공식 홈페이지</a> · <a href="https://m.blog.naver.com/turbo1987">네이버 블로그</a> · <a href="{PREFIX}#regions">전북 출장지역</a><p class="note">제품 구조와 설치 상태에 따라 분해·청소 가능 범위가 달라집니다. 비용과 일정은 상담 후 안내합니다.</p></footer></body></html>'''
 (out/'index.html').write_text(text)
 return url

urls=[]
for slug,name,types,intro,checks,q,a in PRODUCTS:
 title=f'전북 {name} | 홈케어스 클린업'
 desc=f'홈케어스 클린업의 전북 {name} 안내. 전주·익산·군산 등 14개 시·군 출장 상담. 대표전화 1577-7931, 예약문의상담 010-5005-1078.'
 qas=[(q,a),('전주 외 익산·군산이나 군 지역도 방문하나요?','네. '+AREAS+' 등 전북 전지역 방문 청소를 상담합니다. 정확한 주소와 희망 일정을 알려주세요.'),('청소 비용과 소요시간은 어떻게 확인하나요?','모델, 수량, 오염 상태, 설치 환경과 방문 지역을 확인해 안내합니다. 분해 범위, 출장비, 추가 작업비와 예상 시간을 예약 전에 확인해 주세요.'),('완전분해가 가능한지 미리 알 수 있나요?','모델명과 설치 사진을 바탕으로 상담하며, 노후·고착 등 현장 상태에 따라 분해 범위가 달라질 수 있습니다. 모든 제품의 완전분해를 일괄 보장하지 않습니다.'),('어디로 예약 문의하면 되나요?','홈케어스 클린업 대표전화는 1577-7931, 예약문의상담은 010-5005-1078입니다. 지역·모델명·수량·희망 일정을 알려주세요.')]
 body=f'<section class="lead"><p class="eyebrow">전북 14개 시·군 방문 상담</p><h1>전북 {e(name)}</h1><p>홈케어스 클린업은 전북 전지역의 {e(name)}를 상담합니다. {e(types)}의 모델과 설치 상태를 확인해 작업 가능 여부와 견적을 안내합니다.</p>{calls()}</section><section><h2>제품별 청소 안내</h2><p>{e(intro)}</p><h3>상담 전에 준비해 주세요</h3><ul>'+''.join(f'<li>{e(c)}</li>' for c in checks)+'</ul></section><section><h2>작업 범위와 견적 확인</h2><ol><li>방문 지역, 제품 모델, 수량과 설치 사진을 전달합니다.</li><li>청소할 부위와 가능한 분해 범위, 비용 및 예상 시간을 상담합니다.</li><li>방문 일정과 제품 주변 정리 등 준비사항을 확인합니다.</li><li>현장에서 상태를 확인하고, 변경이 필요한 내용은 협의 후 진행합니다.</li></ol><p>단순 외관 청소와 내부 분해청소는 범위가 다릅니다. 부품 교체나 고장 수리가 필요한 경우 청소 견적과 구분해 확인해 주세요.</p></section><section><h2>출장 가능 지역</h2>'+areas()+f'<a href="{PREFIX}#regions">시·군별 출장 상담 안내 보기</a></section>'+case_links(slug)+faq_html(qas)+f'<section><h2>{e(name)} 상담하기</h2><p>방문 지역과 모델명을 먼저 알려주시면 상담에 도움이 됩니다.</p>{calls()}</section><section><h2>다른 가전제품도 함께 확인하세요</h2>'+product_cards()+'</section>'
 urls.append(render(slug,title,desc,body,name))

body='<section class="lead"><p class="eyebrow">홈케어스 클린업 · 전북 전지역</p><h1>전북 가전제품 분해청소<br>지역·제품별 안내</h1><p>홈케어스 클린업은 전주·익산·군산을 포함한 전북 14개 시·군의 에어컨, 세탁기, 건조기, 공기청정기, 제습기, 냉장고 방문 청소를 상담합니다. 제품 모델과 설치 상태에 따라 작업 가능 여부와 분해 범위를 안내합니다.</p>'+calls()+'</section><section><h2>청소할 제품을 선택하세요</h2>'+product_cards()+'</section><section id="regions"><h2>전북 14개 시·군 출장 안내</h2>'+areas()+'<div class="areas">'+''.join(f'<a href="tel:01050051078" aria-label="{name} 출장 상담 010-5005-1078">{name}</a>' for slug,name in CITIES)+'</div><p class="note">아래 지역은 출장 상담 지역이며, 각 지역에 별도 지점이 있다는 의미는 아닙니다.</p></section>'
body+=case_links()
body+=faq_html([('가스건조기도 청소를 문의할 수 있나요?','네. 가스식 제품은 모델과 배기·배관 주변 설치 사진을 먼저 확인합니다. 가스 배관 작업이나 연소부 수리가 기본 청소에 포함되는 것은 아니며 가능한 범위를 별도로 상담합니다.'),('지역별 출장비는 동일한가요?','방문 주소, 제품 수량과 작업 조건을 확인해 출장비 포함 견적을 안내합니다. 일괄 무료 출장이나 동일 금액을 보장하지 않습니다.'),('예약 문의에 필요한 정보는 무엇인가요?','시·군 및 동·읍·면, 제조사와 모델명, 수량, 설치 사진, 희망 일정입니다. 대표전화 1577-7931, 예약문의상담 010-5005-1078로 연락해 주세요.')])
urls.insert(0,render('','전북 가전청소·14개 시군 출장 안내 | 홈케어스 클린업','전북 전지역 에어컨·세탁기·건조기·가스건조기·공기청정기·제습기·냉장고 청소 상담. 대표전화 1577-7931, 예약문의상담 010-5005-1078.',body))
(ROOT/'public'/'sitemap-jeonbuk-services.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>{u}</loc></url>\n' for u in urls)+'</urlset>\n')
print(f'Generated {len(urls)} static HTML pages and one additive sitemap.')
