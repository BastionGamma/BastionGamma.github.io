
// - - - - - - - - - - - - - - - - - - - - - - - 
// FUNCTIONS
// - - - - - - - - - - - - - - - - - - - - - - - 

void fetchBrands() {
  msql = new MySQL( this, "localhost", database, user, pass );
  if (msql.connect()) {
    msql.query(queryBrands);
    while ( msql.next () ) {
      brands = append(brands, msql.getString(1));
    }
  }
  for (int i=0; i<brands.length; i++) {
    brands[i] = brands[i].replace("'", "\\\'");
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void initPlots() {
  plotList = new ArrayList<plot>();
  int allDays[] = new int[0];
  float allScores[] = new float[0];
  if (msql.connect()) {
    for (int i=0; i<brands.length; i++) {
      String q = queryScores.replace("temp", brands[i]);
      brands[i] = brands[i].replace("\\", "");
      println(q);
      int dayofyear[] = new int[0];
      float score_7[] = new float[0];
      msql.query(q);
      while ( msql.next () ) {
        dayofyear = append(dayofyear, msql.getInt(1));
        score_7 = append(score_7, msql.getFloat(2));
        allDays = append(allDays, msql.getInt(1));
        allScores = append(allScores, msql.getFloat(2));
      }
      checkWinLose(i, score_7[0], score_7[score_7.length-1]);
      plotList.add(new plot(brands[i], dayofyear, score_7));
      println("init: " + brands[i] + " x " + score_7.length + "\n");
    }
  }
  minDay = min(allDays);
  maxDay = max(allDays);
  maxScore = max(allScores);
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void checkWinLose(int n, float start, float end) {
  if (end-start > maxWin) {
    maxWin = end-start;
    winningBrand = n;
  }
  if (end-start < maxLose) {
    maxLose = end-start;
    losingBrand = n;
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void keyPressed() {
  if (key == '=' && selectedBrand<brands.length-1) {
    selectedBrand++;
  } else if (key == '-' && selectedBrand>0) {
    selectedBrand--;
  }
}