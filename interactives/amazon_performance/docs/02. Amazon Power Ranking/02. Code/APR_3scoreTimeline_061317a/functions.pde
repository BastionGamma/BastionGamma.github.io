
// - - - - - - - - - - - - - - - - - - - - - - - 
// FUNCTIONS
// - - - - - - - - - - - - - - - - - - - - - - - 

void fetchEntries() {
  msql = new MySQL( this, "localhost", database, user, pass );
  if (msql.connect()) {
    msql.query(query);
    while ( msql.next () ) {
      brand = append(brand, msql.getString(1));
      brands.add(msql.getString(1), 1);
      day = append(day, msql.getInt(2));
      visibility = append(visibility, msql.getFloat(3));
      share = append(share, msql.getFloat(4));
      rank = append(rank, msql.getFloat(5));
    }
  }
  println(brands);
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void drawChart(int[] t, float[] d, int pos, color c) {
  float segWidth = (width-2.0*margin)/t.length;
  float segHeight = (height-2.0*margin)/3;
  for (int i=0; i<t.length; i++) {
    float posX = margin+segWidth*(t[i]-min(t));
    float posY = margin+pos*segHeight;
    float rectH = -1*d[i]*segHeight;
    fill(c);
    noStroke();
    rect(posX, posY, segWidth, rectH);
    fill(100);
    textSize(8);
    text(t[i]-min(t), posX, posY+20);
    text(d[i], posX, posY+rectH-5);
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void keyPressed() {
  if (key == 'p') {
    record = true;
  }
}