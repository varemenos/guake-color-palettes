COLORS="#181818181818:#808000000909:#484851513B3B:#CCCC8A8A3E3E:#56566D6D8C8C:#72724C4C7C7C:#5B5B4F4F4A4A:#ADADA3A37E7E:#555555555555:#ABAB38383434:#A6A6A6A65D5D:#DCDCDEDE7B7B:#2F2F9797C6C6:#D3D330306060:#F3F3DADAB1B1:#F3F3F3F3F3F3"
FOREGROUND="#ADADA3A37A7A"
BACKGROUND="#18181C1C2727"

gconftool-2 -s -t string /apps/guake/style/background/color $BACKGROUND
gconftool-2 -s -t string /apps/guake/style/font/palette $COLORS
gconftool-2 -s -t string /apps/guake/style/font/color $FOREGROUND