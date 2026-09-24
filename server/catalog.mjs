export const cosmeticCatalog=[
{id:'suit_shadow',category:'suit',name:'나이트 스펙터',price:12000,color:'#94ffca',desc:'삼각 정찰 후드 · 짧은 망토 · 경량 장갑'},
{id:'suit_solar',category:'suit',name:'솔라 센티널',price:18000,color:'#ffe5a0',desc:'태양 방패 · T형 바이저 · 중장갑 견갑'},
{id:'suit_warden',category:'suit',name:'아크 워든',price:24000,color:'#79eeff',desc:'기계형 사각 헤드 · 분리 광학 센서 · 양쪽 추진 날개'},
{id:'drone_prism',category:'drone',name:'프리즘 감시자',price:18000,color:'#8ce8ff',desc:'세 갈래 보호 날개와 육각 에너지 코어'},
{id:'trail_plasma',category:'trail',name:'플라스마 리본',price:14500,color:'#81ffe0',desc:'이중 리본 잔광 · 곡선 광선 문양 · 플라스마 고리'},
{id:'suit_ember',category:'suit',name:'잿불 레인저',price:2500,color:'#ff9978',hue:300,desc:'중장갑 방독 헬멧 · 이중 발열 견갑'},
{id:'suit_ice',category:'suit',name:'극지 정찰병',price:5000,color:'#89dfff',hue:100,desc:'극지 후드 · 긴 방한 코트 · 넓은 고글'},
{id:'suit_royal',category:'suit',name:'황실 원정대',price:9000,color:'#e6bbff',hue:180,desc:'기사형 첨두 투구 · 비대칭 견갑 · 분할 망토'},
{id:'drone_arrow',category:'drone',name:'화살촉 드론',price:4000,color:'#89f2ca',desc:'날렵한 삼각 날개형 기체'},
{id:'drone_orbit',category:'drone',name:'궤도 관측자',price:8000,color:'#d5b8ff',desc:'회전하는 고리가 달린 구형 기체'},
{id:'drone_crown',category:'drone',name:'황금 수호기',price:14000,color:'#ffe399',desc:'네 갈래 날개를 펼친 황금 기체'},
{id:'trail_ember',category:'trail',name:'혜성의 꼬리',price:3000,color:'#ffad78',desc:'갈매기형 잔광 · 화염 문양 · 폭발 가장자리 장식'},
{id:'trail_ice',category:'trail',name:'서리 결정',price:6500,color:'#a2ecff',desc:'마름모 결정 · 결정형 광선 · 서리 고리'},
{id:'trail_star',category:'trail',name:'별빛 섬광',price:11000,color:'#f6ceff',desc:'십자 별빛 · 광선 별무늬 · 별자리 파동'}
];
export function cleanCosmetics(input){
 const out={owned:[],equipped:{suit:'default',drone:'default',trail:'default'}};
 if(input==null)return out;
 if(typeof input!=='object'||!Array.isArray(input.owned)||input.owned.length>cosmeticCatalog.length)throw Error('외형 보유 기록이 올바르지 않습니다.');
 for(const id of input.owned){if(!cosmeticCatalog.some(c=>c.id===id))throw Error('알 수 없는 외형입니다.');if(!out.owned.includes(id))out.owned.push(id)}
 for(const category of ['suit','drone','trail']){
 const id=input.equipped?.[category]??'default';if(id!=='default'&&(!out.owned.includes(id)||!cosmeticCatalog.some(c=>c.id===id&&c.category===category)))throw Error('장착할 수 없는 외형입니다.');out.equipped[category]=id;
 }return out;
}


export const titleCatalog=[
 {id:'wanderer',name:'별먼지 방랑자',tag:'STARDUST',price:1500,color:'#a3dbd0',medal:3,desc:'이름 없는 궤도에서도 나만의 길을 찾는다.'},
 {id:'vanguard',name:'철의 선봉',tag:'VANGUARD',price:4000,color:'#f0ad83',medal:6,desc:'가장 먼저 진입하고, 마지막까지 버틴다.'},
 {id:'neon',name:'네온 추적자',tag:'NEON HUNTER',price:8000,color:'#89d9ff',medal:7,desc:'어둠을 가르는 푸른 잔광의 주인.'},
 {id:'void',name:'공허 항해사',tag:'VOID WALKER',price:15000,color:'#cba9fa',medal:8,desc:'별빛마저 닿지 않는 경계를 넘어.'},
 {id:'guardian',name:'은하의 수호자',tag:'GALACTIC GUARD',price:30000,color:'#ffdb88',medal:4,desc:'수많은 전장을 지나, 하나의 전설로.'},
 {id:'normal25',name:'전선의 이름',tag:'NORMAL · TOP 25',difficulty:0,threshold:25,color:'#8dc9ff',medal:2,desc:'노멀 맵별 전체 랭킹 25위 이내 유지'},
 {id:'normal10',name:'푸른 선봉',tag:'NORMAL · TOP 10',difficulty:0,threshold:10,color:'#8dc9ff',medal:5,desc:'노멀 맵별 전체 랭킹 10위 이내 유지'},
 {id:'normal3',name:'전장의 영웅',tag:'NORMAL · TOP 3',difficulty:0,threshold:3,color:'#8dc9ff',medal:9,desc:'노멀 맵별 전체 랭킹 3위 이내 유지'},
 {id:'normal1',name:'노멀 챔피언',tag:'NORMAL · TOP 1',difficulty:0,threshold:1,color:'#8dc9ff',medal:1,desc:'노멀 맵별 전체 랭킹 1위 이내 유지'},
 {id:'hard25',name:'강철의 이름',tag:'HARD · TOP 25',difficulty:1,threshold:25,color:'#edaa75',medal:2,desc:'하드 맵별 전체 랭킹 25위 이내 유지'},
 {id:'hard10',name:'불굴의 선봉',tag:'HARD · TOP 10',difficulty:1,threshold:10,color:'#edaa75',medal:5,desc:'하드 맵별 전체 랭킹 10위 이내 유지'},
 {id:'hard3',name:'강철의 영웅',tag:'HARD · TOP 3',difficulty:1,threshold:3,color:'#edaa75',medal:9,desc:'하드 맵별 전체 랭킹 3위 이내 유지'},
 {id:'hard1',name:'하드 패권자',tag:'HARD · TOP 1',difficulty:1,threshold:1,color:'#edaa75',medal:1,desc:'하드 맵별 전체 랭킹 1위 이내 유지'},
 {id:'extreme25',name:'극한의 이름',tag:'EXTREME · TOP 25',difficulty:2,threshold:25,color:'#dcbbff',medal:2,desc:'익스트림 맵별 전체 랭킹 25위 이내 유지'},
 {id:'extreme10',name:'공허의 선봉',tag:'EXTREME · TOP 10',difficulty:2,threshold:10,color:'#dcbbff',medal:5,desc:'익스트림 맵별 전체 랭킹 10위 이내 유지'},
 {id:'extreme3',name:'극한의 전설',tag:'EXTREME · TOP 3',difficulty:2,threshold:3,color:'#dcbbff',medal:9,desc:'익스트림 맵별 전체 랭킹 3위 이내 유지'},
 {id:'extreme1',name:'익스트림 군주',tag:'EXTREME · TOP 1',difficulty:2,threshold:1,color:'#dcbbff',medal:1,desc:'익스트림 맵별 전체 랭킹 1위 이내 유지'}
];
