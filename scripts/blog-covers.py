# Blog covers: one SVG per post in public/blog/covers, drawn from what the post is
# about (and, for releases, HIGHLIGHTS). Run after adding a post:  python3 scripts/blog-covers.py

import os, re, html
OUT=os.path.join(os.path.dirname(__file__), '..', 'public', 'blog', 'covers')
BLOG=os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'blog')
W,H=1200,630
BG='#0a0a12'; SURF='#14141f'; ELEV='#1b1b29'; BORDER='#26263a'; TEXT='#ececf4'; MUTED='#9a9ab3'; FAINT='#6b6b85'
ACC='#7c74ff'; AMBER='#f59e0b'; GREEN='#34d399'; RED='#f87171'; PINK='#f472b6'; ORANGE='#fb923c'; BLUE='#60a5fa'
FONT="font-family=\"Geist, Inter, -apple-system, Segoe UI, sans-serif\""
MONO="font-family=\"Geist Mono, Menlo, Consolas, monospace\""
e=html.escape
def t(x,y,s,size=22,fill=TEXT,weight=400,mono=False,anchor='start'):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}" {MONO if mono else FONT} text-anchor="{anchor}">{e(s)}</text>'
def r(x,y,w,h,fill=SURF,rx=14,stroke=BORDER,sw=1.5,op=1):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" opacity="{op}"/>'
def window(x,y,w,h,title=''):
    s=r(x,y,w,h,SURF,18)
    s+=f'<path d="M{x} {y+46} H{x+w}" stroke="{BORDER}" stroke-width="1.5"/>'
    for i,c in enumerate(['#ff5f57','#febc2e','#28c840']):
        s+=f'<circle cx="{x+26+i*22}" cy="{y+23}" r="7" fill="{c}"/>'
    if title: s+=t(x+w/2,y+30,title,16,MUTED,anchor='middle')
    return s
def folder(x,y,s=1,c=AMBER):
    return f'<path transform="translate({x},{y}) scale({s})" d="M2 8 a4 4 0 0 1 4-4 h9 l4 4 h15 a4 4 0 0 1 4 4 v18 a4 4 0 0 1-4 4 H6 a4 4 0 0 1-4-4z" fill="none" stroke="{c}" stroke-width="2.4"/>'
def filei(x,y,s=1,c=MUTED):
    return f'<path transform="translate({x},{y}) scale({s})" d="M8 2 h16 l8 8 v26 a3 3 0 0 1-3 3 H8 a3 3 0 0 1-3-3 V5 a3 3 0 0 1 3-3z M24 2 v8 h8" fill="none" stroke="{c}" stroke-width="2.4"/>'
def frame(inner, label, color=ACC):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs><radialGradient id="g" cx="50%" cy="0%" r="75%"><stop offset="0" stop-color="{color}" stop-opacity="0.32"/><stop offset="1" stop-color="{BG}" stop-opacity="0"/></radialGradient></defs>
<rect width="{W}" height="{H}" fill="{BG}"/><rect width="{W}" height="{H}" fill="url(#g)"/>
{inner}
{t(60,H-42,label,18,FAINT,500)}
</svg>'''
def row(x,y,w,icon,name,meta='',sel=False,h=44):
    s=r(x,y,w,h,'#262a52' if sel else 'none',8,'none',0)
    s+=icon(x+14,y+8,0.75)
    s+=t(x+56,y+29,name,19,TEXT)
    if meta: s+=t(x+w-16,y+29,meta,16,MUTED,anchor='end')
    return s
def kbd(x,y,label,w=None):
    w=w or 18+len(label)*14
    return r(x,y,w,44,ELEV,10)+f'<path d="M{x+4} {y+42} H{x+w-4}" stroke="{BORDER}" stroke-width="3"/>'+t(x+w/2,y+30,label,20,TEXT,600,True,'middle'), w

covers={}
HIGHLIGHTS={
    '0.1.13': ['macOS: folders open in Files, not Finder', 'open . in the terminal opens Files', 'Finder comes back if Files is gone'],
    '0.1.14': ['One Files at a time: folders as new tabs', 'Windows: folders open in Files, not Explorer', 'Restore Explorer in one click'],
    '0.1.15': ['Photo, video and archive details in the preview', 'ISO images open like archives', 'Mount ISO, DMG, IMG and VHD', 'Windows drives in CONNECTED'],
    '0.1.16': ['Themes: Omarchy and Catppuccin', 'Icon styles: colorful, monochrome, accent', 'Settings in a tab', 'Show in folder selects the file'],
    '0.1.17': ['Big folders 80× lighter to draw', 'Report a Bug, straight to GitHub', 'Sturdier Linux builds'],
    '0.1.18': ['Windows programs show their own icon', 'Product, version, signature in the preview', 'The AppImage is back'],
    '0.1.19': ['Windows and macOS themes', 'Any system font', 'DevTools: Tasks, Indexes, Search'],
    '0.1.20': ['PDFs scroll page by page', 'Code in the preview panel', 'Paths in ⌘K', 'Corner sizes · Preview SDK'],
    '0.1.21': ['Favorites take files too', 'Its own icon, one click to open', 'Middle-click: show in folder'],
    '0.1.22': ['Pictures show whole', 'Fit ⇄ Fill, remembered'],
    '0.1.23': ['The files command', 'A clean uninstaller', 'Word, ODT and PowerPoint text', 'Quick Look and ⌘K open at once'],
    '0.1.24': ['Quick Actions: convert, rotate, your scripts', 'libfiles and agent-written scripts', 'Open With like Finder', 'Tabs come back'],
    '0.1.28': ['Two memory leaks fixed', 'File entries freed as you go', 'Pause in the Music preview'],
    '0.1.26': ['SVG thumbnails cached at 320 px', '~290 ms → ~18 ms per screen', 'Windows and Linux builds fixed'],
    '0.1.25': ['macOS apps open with a double-click', 'Show Package Contents', 'Music from the keyboard'],
}

def release(v, summary):
    import textwrap
    s=window(150,90,900,450,'Files')
    s+=r(190,150,150,38,'#123a2c',19,GREEN,1.5)+t(265,176,'Release',18,GREEN,600,anchor='middle')
    s+=t(190,262,f'Files {v}',76,TEXT,700)
    # What it brings, in its own words.
    # What it brings, as written for each release.
    parts=HIGHLIGHTS.get(v) or [summary]
    for i,part in enumerate(parts):
        line=textwrap.shorten(part, 60, placeholder='…')
        s+=f'<circle cx="200" cy="{318+i*46}" r="6" fill="{[ACC,AMBER,GREEN,PINK][i]}"/>'+t(222,326+i*46,line,23,MUTED)
    return frame(s,'Release notes')
for slug in os.listdir(BLOG):
    m=re.match(r'files-(\d+)-(\d+)-(\d+)\.mdx',slug)
    if m:
        text=open(os.path.join(BLOG,slug)).read()
        summary=re.search(r'^summary: (.*)$',text,re.M).group(1).strip('"')
        covers[slug[:-4]]=release('.'.join(m.groups()), summary)

# ---- topics
def big_folders():
    s=window(90,90,560,450,'5,000 files')
    for i in range(8):
        s+=row(110,150+i*46,520,filei if i>1 else folder,f'file-{i:05}.{"png rs zip mp4 txt".split()[i%5]}' if i>1 else f'folder {i+1}', '' ,i==3)
    s+=t(700,210,'Allocations per frame',22,MUTED)
    s+=r(700,240,420,36,RED,8,'none',0,0.9)+t(712,265,'595,000 · before',18,'#1a0a0a',700)
    s+=r(700,300,6,36,GREEN,3,'none',0)+t(720,325,'7,100 · after',20,GREEN,700)
    s+=t(700,420,'×84',96,TEXT,800)
    return frame(s,'Performance')
covers['big-folders-80x-lighter']=big_folders()

def devtools():
    s=window(90,80,1020,470,'Console · DevTools')
    for i,tab in enumerate(['Events','Tasks','Indexes','Search','Resources']):
        s+=r(110+i*130,146,118,34,ACC if i==1 else 'none',8,'none' if i==1 else BORDER,1.2)+t(169+i*130,169,tab,16,'#fff' if i==1 else MUTED,500,anchor='middle')
    rows=[('Running',ACC,'thumbnail','IMG_2041.HEIC','—'),('Done',GREEN,'file details','trip.mov','42 ms'),('Done',GREEN,'folder size','~/Projects','310 ms'),('Failed',RED,'quick look','broken.pdf','retry'),('Queued',MUTED,'program icon','game.exe','cancel')]
    for i,(st,c,kind,label,tm) in enumerate(rows):
        y=210+i*62
        s+=f'<path d="M110 {y+48} H1090" stroke="{BORDER}"/>'
        s+=t(120,y+32,st,18,c,600)+t(250,y+32,kind,18,MUTED)+t(450,y+32,label,18,TEXT,mono=True)+t(1070,y+32,tm,18,FAINT,anchor='end',mono=True)
    k1,w1=kbd(900,96,'⌘'); k2,w2=kbd(900+w1+8,96,'⇧'); k3,_=kbd(900+w1+w2+16,96,'D')
    return frame(s+k1+k2+k3,'DevTools')
covers['devtools']=devtools()

def sidebar(items, x=90,y=90,h=450,title='Favorites'):
    s=r(x,y,320,h,ELEV,18)+t(x+24,y+42,title.upper(),15,ACC,600)
    for i,(icon,name,sel) in enumerate(items):
        s+=row(x+12,y+62+i*48,296,icon,name,'',sel)
    return s
def favorite_files():
    s=sidebar([(folder,'Projects',False),(folder,'Photos 2026',False),(filei,'Budget 2026.xlsx',True),(filei,'Notes.md',False),(filei,'Cyberpunk2077.exe',False)])
    s+=window(470,90,640,450,'Budget 2026.xlsx')
    for i in range(6):
        for j in range(4):
            s+=r(500+j*150,160+i*56,140,46,SURF if (i+j)%2 else ELEV,6,BORDER,1)
    s+=f'<path d="M440 250 l18 0" stroke="{AMBER}" stroke-width="3"/>'+f'<polygon points="420,226 426,240 441,241 430,251 433,266 420,258 407,266 410,251 399,241 414,240" fill="{AMBER}"/>'
    return frame(s,'Favorites')
covers['favorite-files']=favorite_files()

def terminal(lines, x=90,y=110,w=620,h=400,title='Terminal'):
    s=window(x,y,w,h,title)
    for i,(txt,c) in enumerate(lines):
        s+=t(x+28,y+92+i*40,txt,22,c,mono=True)
    return s
def files_command():
    s=terminal([('~/Projects $ files .',TEXT),('',TEXT),('~ $ files ~/Music',TEXT),('',TEXT),('~ $ █',ACC)])
    s+=window(760,150,360,330,'Files')
    s+=row(780,215,320,folder,'Projects','',True)+row(780,265,320,folder,'Music')+row(780,315,320,folder,'Documents')
    s+=f'<path d="M720 300 C 740 300, 740 300, 755 300" stroke="{ACC}" stroke-width="4" marker-end="url(#a)"/><defs><marker id="a" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="{ACC}"/></marker></defs>'
    return frame(s,'Command line')
covers['files-command']=files_command()

def open_terminal():
    s=terminal([('$ open .',TEXT),('$ open ~/Downloads',TEXT),('$ open report.pdf',MUTED),('  → still Preview.app',FAINT)],title='zsh')
    s+=window(760,150,360,330,'Files')+row(780,215,320,folder,'Downloads','',True)+row(780,265,320,folder,'Desktop')
    return frame(s,'macOS')
covers['open-folders-from-terminal']=open_terminal()

def fit_fill():
    s=''
    for k,(x,label,fit) in enumerate([(110,'Fit',True),(630,'Fill',False)]):
        s+=r(x,110,460,360,ELEV,18)
        if fit:
            s+=f'<rect x="{x+90}" y="130" width="280" height="320" rx="10" fill="url(#sky)"/>'
        else:
            s+=f'<clipPath id="c{k}"><rect x="{x}" y="110" width="460" height="360" rx="18"/></clipPath><rect x="{x-40}" y="60" width="540" height="620" fill="url(#sky)" clip-path="url(#c{k})"/>'
        s+=r(x+180,490,100,40,ACC if fit else 'none',20,ACC,1.5)+t(x+230,517,label,18,'#fff' if fit else ACC,600,anchor='middle')
    s='<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4338ca"/><stop offset="0.6" stop-color="#f472b6"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>'+s
    return frame(s,'Preview')
covers['fit-or-fill']=fit_fill()

def instant():
    s=window(90,90,520,450,'Quick Look')
    s+=t(350,320,'Loading preview…',24,MUTED,anchor='middle')
    s+=f'<circle cx="350" cy="250" r="30" fill="none" stroke="{ACC}" stroke-width="5" stroke-dasharray="120 80"/>'
    s+=f'<path d="M640 315 h40" stroke="{FAINT}" stroke-width="4"/>'
    s+=window(700,90,420,450,'Report.docx')
    for i,wd in enumerate([300,360,340,250,370,330,280,360,200]):
        s+=r(730,160+i*38,wd,12,MUTED if i else TEXT,6,'none',0,0.55 if i else 0.9)
    return frame(s,'Quick Look')
covers['instant-previews-documents']=instant()

def tabs_bar(names, active=0, y=110):
    s=''
    x=110
    for i,n in enumerate(names):
        w=40+len(n)*11
        s+=r(x,y,w,44,ELEV if i==active else SURF,10,ACC if i==active else BORDER,1.5)+t(x+w/2,y+29,n,17,TEXT if i==active else MUTED,500,anchor='middle')
        x+=w+10
    return s
def middle_click():
    s=window(90,70,1020,490,'Files')
    s+=tabs_bar(['Home','Projects','Music  ×'],2,130)
    s+=row(110,210,600,folder,'Projects','',True)+row(110,260,600,folder,'Photos')+row(110,310,600,folder,'Music')
    s+=f'<rect x="830" y="230" width="140" height="220" rx="70" fill="none" stroke="{TEXT}" stroke-width="4"/><path d="M900 230 V320" stroke="{TEXT}" stroke-width="4"/><rect x="888" y="262" width="24" height="40" rx="12" fill="{ACC}"/>'
    return frame(s,'Tabs')
covers['middle-click-tabs']=middle_click()

def mount():
    s=window(90,90,560,450,'Downloads')
    s+=row(110,150,520,filei,'ubuntu-24.04.iso','6.1 GB',True)+row(110,200,520,filei,'Files-0.1.23.dmg','58 MB')
    s+=r(330,200,270,150,ELEV,12)+t(350,236,'Open',18,MUTED)+r(340,254,250,40,ACC,8,'none',0)+t(352,281,'Mount',19,'#fff',600)+t(350,326,'Quick Look',18,MUTED)
    s+=sidebar([(folder,'ubuntu-24.04',True),(folder,'USB Stick',False)],x=780,y=150,h=250,title='Connected')
    return frame(s,'Disk images')
covers['mount-disk-images']=mount()

def themes():
    s=''
    for i,(name,bg,sb,acc,txt) in enumerate([('Files','#101115','#15161b','#938ffb','#f1f2f5'),('macOS','#1e1e1e','#282828','#0a84ff','#f5f5f7'),('Windows','#202020','#1c1c1c','#4cc2ff','#ffffff'),('Omarchy','#1a1b26','#16161e','#7aa2f7','#c0caf5'),('Catppuccin','#1e1e2e','#181825','#cba6f7','#cdd6f4')]):
        x=70+i*218
        s+=f'<rect x="{x}" y="120" width="200" height="320" rx="{0 if name=="Omarchy" else 14}" fill="{bg}" stroke="{BORDER}" stroke-width="1.5"/>'
        s+=f'<rect x="{x}" y="120" width="62" height="320" rx="{0 if name=="Omarchy" else 14}" fill="{sb}"/>'
        for j in range(4):
            s+=f'<rect x="{x+76}" y="{150+j*44}" width="{100-j*12}" height="14" rx="7" fill="{txt}" opacity="0.5"/>'
        s+=f'<rect x="{x+76}" y="350" width="100" height="34" rx="{0 if name=="Omarchy" else 10}" fill="{acc}"/>'
        s+=t(x+100,480,name,22,TEXT,600,name=='Omarchy','middle')
    s+=t(600,550,'Aa  Font: any installed',22,MUTED,anchor='middle')
    return frame(s,'Appearance')
covers['native-themes-and-fonts']=themes()

def omarchy():
    s=''
    for i,(name,bg,acc,txt,mono) in enumerate([('Omarchy','#1a1b26','#7aa2f7','#c0caf5',True),('Catppuccin','#1e1e2e','#cba6f7','#cdd6f4',False)]):
        x=110+i*520
        s+=f'<rect x="{x}" y="110" width="460" height="360" rx="{0 if mono else 16}" fill="{bg}" stroke="{"#414868" if mono else BORDER}" stroke-width="2"/>'
        for j,n in enumerate(['projects/','notes.md','photos/','todo.txt']):
            y=170+j*60
            if j==0: s+=f'<rect x="{x+16}" y="{y-30}" width="428" height="44" rx="{0 if mono else 8}" fill="{acc}" opacity="0.22"/>'
            s+=t(x+36,y,n,22,txt,400,mono)
        s+=t(x+230,520,name,24,TEXT,600,mono,'middle')
    return frame(s,'Themes')
covers['themes-omarchy-catppuccin']=omarchy()

def one_instance():
    s=terminal([('$ files ~/Music',TEXT),('$ open ~/Downloads',TEXT)],x=90,y=150,w=440,h=260,title='Terminal')
    s+=window(600,100,510,430,'Files')
    s+=tabs_bar(['Home','Music','Downloads'],2,160).replace('x="110"','x="620"')
    s=s
    s+=t(855,360,'one window · new tabs',22,MUTED,anchor='middle')
    return frame(s,'Single instance')
covers['one-files-at-a-time']=one_instance()

def paths():
    s=window(150,110,900,410,'⌘K')
    s+=r(180,170,840,58,ELEV,12)+t(206,208,'~/Projects/fi',24,TEXT,400,True)+f'<rect x="420" y="186" width="2" height="28" fill="{ACC}"/>'
    s+=row(190,250,820,folder,'files','~/Projects',True)+row(190,300,820,folder,'files-website','~/Projects')+row(190,350,820,folder,'fixtures','~/Projects')
    s+=t(190,470,'Enter opens the folder',18,FAINT)
    return frame(s,'Search')
covers['paths-in-cmd-k']=paths()

def preview_tells():
    s=window(90,80,480,470,'IMG_2041.jpg')
    s+=f'<defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#7c74ff"/></linearGradient></defs><rect x="120" y="150" width="420" height="300" rx="12" fill="url(#p)"/><circle cx="460" cy="220" r="34" fill="{AMBER}"/>'
    s+=r(620,80,490,470,ELEV,18)
    for i,(k,v) in enumerate([('CAMERA',''),('Model','EOS R6'),('Lens','24–70 mm f/2.8'),('EXPOSURE',''),('Aperture','f/4'),('Shutter','1/250 s'),('ISO','160'),('LOCATION',''),('Coordinates','52.37, 4.89')]):
        y=126+i*46
        s+=t(650,y,k,15 if not v else 19,ACC if not v else MUTED,600 if not v else 400)+(t(1080,y,v,19,TEXT,anchor='end') if v else '')
    return frame(s,'Preview')
covers['preview-tells-everything']=preview_tells()

def pdf_sdk():
    s=window(90,80,520,470,'manual.pdf')
    for i in range(3):
        s+=r(150,140+i*140,400,120,'#f5f5f7',6,'none',0)
        for j in range(4): s+=r(170,160+i*140+j*22,300-j*40,8,'#9a9ab3',4,'none',0)
    s+=r(660,120,450,400,ELEV,16)
    for i,(txt,c) in enumerate([('impl PreviewProvider',ACC),('  for Notebooks {',TEXT),('  fn handles(&self, p)',MUTED),('  fn preview(&self, p)',MUTED),('    -> PreviewContent',GREEN),('}',TEXT)]):
        s+=t(690,180+i*50,txt,21,c,mono=True)
    return frame(s,'Previews · SDK')
covers['previews-pdf-code-sdk']=pdf_sdk()

def bug():
    s=window(250,90,700,450,'Report a bug')
    s+=t(290,175,'Title',17,MUTED)+r(290,188,620,46,ELEV,10)+t(306,218,'Preview stays empty for HEIC',19,TEXT)
    s+=t(290,268,'What happened',17,MUTED)+r(290,280,620,120,ELEV,10)
    for i in range(3): s+=r(306,302+i*28,[520,460,300][i],10,MUTED,5,'none',0,0.5)
    s+=r(760,430,150,44,ACC,10,'none',0)+t(835,459,'Send report',18,'#fff',600,anchor='middle')
    s+=f'<g transform="translate(130 260)"><ellipse cx="40" cy="44" rx="30" ry="38" fill="none" stroke="{RED}" stroke-width="5"/><path d="M40 6 v76 M10 44 H70 M14 20 l-12 -10 M66 20 l12 -10 M12 66 l-12 10 M68 66 l12 10" stroke="{RED}" stroke-width="5"/></g>'
    return frame(s,'Feedback')
covers['report-a-bug']=bug()

def search_filters():
    s=window(150,110,900,410,'Search')
    s+=r(180,170,840,58,ELEV,12)+t(206,208,'kind:image  size:>10mb  modified:<7d',24,TEXT,400,True)
    for i,(c,label) in enumerate([(ACC,'kind:image'),(AMBER,'size:>10mb'),(GREEN,'modified:<7d')]):
        s+=r(190+i*230,250,210,40,c,20,'none',0,0.2)+t(295+i*230,277,label,18,c,600,True,'middle')
    s+=row(190,320,820,filei,'IMG_2041.HEIC','24 MB · yesterday',True)+row(190,370,820,filei,'panorama.png','61 MB · 3 days ago')
    return frame(s,'Search')
covers['search-filters']=search_filters()

def settings_tab():
    s=window(90,80,1020,470,'Files')
    s+=tabs_bar(['Home','Projects','⚙ Settings'],2,140)
    s+=r(110,210,220,320,ELEV,12)
    for i,n in enumerate(['General','Appearance','Extensions','Sound','Storage']):
        s+=r(122,226+i*54,196,42,ACC if i==1 else 'none',8,'none',0,0.9 if i==1 else 1)+t(140,254+i*54,n,18,'#fff' if i==1 else MUTED)
    s+=t(370,250,'Theme',20,MUTED)
    for i,c in enumerate(['#101115','#1e1e1e','#202020','#1a1b26','#1e1e2e']):
        s+=f'<rect x="{480+i*110}" y="222" width="90" height="56" rx="10" fill="{c}" stroke="{ACC if i==3 else BORDER}" stroke-width="2"/>'
    return frame(s,'Settings')
covers['settings-in-a-tab']=settings_tab()

def storage():
    import math
    s=r(110,90,980,450,ELEV,18)
    cx,cy,R=330,315,140
    parts=[(0.46,ACC,'Extensions'),(0.27,AMBER,'Thumbnails'),(0.17,GREEN,'Forks'),(0.1,PINK,'Search index')]
    a=-math.pi/2
    for frac,c,_ in parts:
        b=a+frac*2*math.pi
        x1,y1=cx+R*math.cos(a),cy+R*math.sin(a); x2,y2=cx+R*math.cos(b),cy+R*math.sin(b)
        s+=f'<path d="M{x1:.1f} {y1:.1f} A{R} {R} 0 {1 if frac>0.5 else 0} 1 {x2:.1f} {y2:.1f}" fill="none" stroke="{c}" stroke-width="46"/>'
        a=b+0.03
    s+=t(cx,cy+4,'1.2 GB',34,TEXT,700,anchor='middle')+t(cx,cy+36,'in cache',17,MUTED,anchor='middle')
    for i,(frac,c,n) in enumerate(parts):
        y=180+i*64
        s+=f'<circle cx="590" cy="{y}" r="9" fill="{c}"/>'+t(614,y+7,n,21,TEXT)+t(1060,y+7,f'{int(frac*1200)} MB',19,MUTED,anchor='end')
    s+=r(590,450,470,8,BORDER,4,'none',0)+r(590,450,240,8,ACC,4,'none',0)+f'<circle cx="830" cy="454" r="12" fill="{TEXT}"/>'+t(590,500,'Limit · 1 GB',18,FAINT)
    return frame(s,'Storage')
covers['storage-and-cache-limit']=storage()

def exe():
    s=window(90,90,560,450,'Games')
    s+=f'<rect x="150" y="170" width="150" height="150" rx="24" fill="#fcee0a"/><text x="225" y="270" font-size="78" font-weight="800" fill="#111" text-anchor="middle" {FONT}>77</text>'
    s+=t(225,360,'Cyberpunk2077.exe',18,TEXT,anchor='middle')
    s+=f'<rect x="380" y="170" width="150" height="150" rx="24" fill="#334155"/>'+filei(420,200,2,MUTED)+t(455,360,'setup.exe',18,MUTED,anchor='middle')
    s+=r(700,90,410,450,ELEV,18)
    for i,(k,v) in enumerate([('APPLICATION',''),('Product','Cyberpunk 2077'),('Company','CD PROJEKT RED'),('Version','2.21'),('PROGRAM',''),('Built for','x64 · 64-bit'),('Signed','Yes (Authenticode)')]):
        y=140+i*52
        s+=t(730,y,k,15 if not v else 19,ACC if not v else MUTED,600 if not v else 400)+(t(1085,y,v,19,TEXT,anchor='end') if v else '')
    return frame(s,'Windows programs')
covers['windows-programs-icons']=exe()

def quick_actions():
    s=window(90,80,560,470,'Photos')
    s+=row(110,140,520,filei,'IMG_2041.HEIC','',True)+row(110,190,520,filei,'IMG_2042.HEIC','',True)
    s+=r(300,250,300,250,ELEV,12)
    for i,(label,on) in enumerate([('Copy',False),('Quick Actions  ›',True),('Delete…',False)]):
        s+=r(312,264+i*48,276,40,ACC if on else 'none',8,'none',0)+t(328,290+i*48,label,18,'#fff' if on else MUTED)
    s+=r(700,140,410,250,ELEV,14)
    for i,(label,c) in enumerate([('Convert Image…',TEXT),('Rotate Image…',TEXT),('Resize for web (Python)',GREEN),('Customize…',MUTED)]):
        s+=t(726,186+i*52,label,20,c)
    s+=r(700,420,410,110,SURF,12)+t(722,456,'import libfiles',18,ACC,mono=True)+t(722,490,'libfiles.ask(...)',18,MUTED,mono=True)
    return frame(s,'Quick Actions')
covers['quick-actions']=quick_actions()

def open_with():
    s=window(90,90,480,450,'Deck.pptx')
    s+=row(110,150,440,filei,'Deck.pptx','',True)
    s+=r(560,150,280,60,ELEV,10)+t(580,188,'Open With  ›',20,TEXT)
    s+=r(860,150,260,330,ELEV,14)
    for i,(label,c) in enumerate([('Keynote (default)',TEXT),('LibreOffice',GREEN),('PowerPoint',TEXT),('Kimi',MUTED),('Choose Application…',MUTED)]):
        s+=t(884,196+i*58,label,19,c,600 if i==1 else 400)
    return frame(s,'Open With')
covers['open-with-like-finder']=open_with()

def packages():
    s=window(90,90,560,450,'Applications')
    for i,(n,c) in enumerate([('Keynote.app','#3b82f6'),('LibreOffice.app','#22c55e'),('Xcode.app','#0ea5e9')]):
        s+=f'<rect x="{130+i*170}" y="150" width="120" height="120" rx="26" fill="{c}"/>'+t(190+i*170,300,n,17,TEXT,anchor='middle')
    s+=r(300,330,320,150,ELEV,12)+t(316,366,'Open',18,MUTED)+t(316,406,'Quick Actions  ›',18,TEXT)
    s+=r(700,330,410,80,ACC,12,'none',0)+t(724,378,'Show Package Contents',22,'#fff',600)
    s+=t(700,460,'Contents/  MacOS/  Resources/',20,MUTED,mono=True)
    return frame(s,'macOS')
covers['show-package-contents']=packages()

def music_keys():
    s=window(90,80,640,470,'Music')
    for i in range(6):
        sel=i==2
        s+=r(110,140+i*62,600,54,'#262a52' if sel else 'none',8,'none',0)
        if sel: s+=f'<rect x="110" y="{140+i*62}" width="4" height="54" fill="{ACC}"/>'
        s+=r(128,148+i*62,38,38,ELEV,6,'none',0)+t(184,172+i*62,['Intro','Night Drive','Blue Hour','Afterglow','Tides','Home'][i],19,TEXT)
    x=790
    for row,keys in enumerate([['↑'],['↓'],['Enter'],['Space']]):
        cx=x
        for k in keys:
            svg,w=kbd(cx,150+row*80,k); s+=svg; cx+=w+10
        s+=t(cx+10,180+row*80,['previous','next','play','preview'][row],18,MUTED)
    return frame(s,'Music')
covers['music-keyboard']=music_keys()

def svg_stress():
    s=window(90,80,620,470,'5,000 SVGs with filters')
    hues=['#6366f1','#ec4899','#22c55e','#f59e0b','#0ea5e9','#a855f7','#ef4444','#14b8a6','#eab308']
    for i in range(9):
        x=120+(i%3)*190; y=140+(i//3)*130
        s+=r(x,y,170,110,hues[i],12,'none',0)+f'<circle cx="{x+85}" cy="{y+50}" r="30" fill="#fff" opacity="0.35"/>'
    s+=t(760,190,'before',20,MUTED)+t(760,240,'290 ms',44,TEXT,600)+t(760,275,'per card',18,MUTED)
    s+=t(760,360,'now',20,MUTED)+t(760,410,'18 ms',44,ACC,600)+t(760,445,'per screen',18,MUTED)
    return frame(s,'Stress test')
covers['svg-stress-test']=svg_stress()

def memory_leak():
    s=window(90,80,640,470,'DevTools — Indexes')
    rows=[('File entries','2,431 alive'),('Folder listings','12 folders'),('Thumbnails','0 waiting')]
    for i,(a,b) in enumerate(rows):
        s+=t(120,170+i*56,a,20,TEXT)+t(700,170+i*56,b,20,MUTED,anchor='end')
    s+='<polyline points="130,500 230,470 330,430 430,380 530,330 630,280" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>'
    s+='<polyline points="130,500 230,488 330,492 430,486 530,490 630,488" fill="none" stroke="'+ACC+'" stroke-width="5" stroke-linecap="round"/>'
    s+=t(780,200,'before',20,MUTED)+t(780,250,'18 GB',48,'#ef4444',600)+t(780,285,'after days',18,MUTED)
    s+=t(780,370,'now',20,MUTED)+t(780,420,'flat',48,ACC,600)+t(780,455,'freed as you go',18,MUTED)
    return frame(s,'Memory')
covers['memory-leak-fixed']=memory_leak()

for slug,svg in covers.items():
    open(os.path.join(OUT,slug+'.svg'),'w').write(svg)
# frontmatter
missing=[]
for f in os.listdir(BLOG):
    slug=f[:-4]
    p=os.path.join(BLOG,f)
    s=open(p).read()
    if slug not in covers: missing.append(slug); continue
    s=re.sub(r'^cover: .*$',f'cover: /blog/covers/{slug}.svg',s,count=1,flags=re.M)
    open(p,'w').write(s)
print(len(covers),'covers; missing',missing)
