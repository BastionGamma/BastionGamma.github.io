
// - - - - - - - - - - - - - - - - - - - - - - - 
// FUNCTIONS
// - - - - - - - - - - - - - - - - - - - - - - - 

void fetchBrands() {
  msql = new MySQL( this, "localhost", database, user, pass );
  if (msql.connect()) {
    msql.query(queryBrands);
    while ( msql.next () ) {
      if (!msql.getString(1).equals("NO DATA")) {
        brands = append(brands, msql.getString(1));
      }
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
  IntDict daysCount = new IntDict();
  FloatDict scoresTotal = new FloatDict();
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
        daysCount.add(str(msql.getInt(1)), 1);
        scoresTotal.add(str(msql.getInt(1)), msql.getFloat(2));
      }
      if (score_7.length > 1) {
        checkWinLose(i, score_7[0], score_7[score_7.length-1]);
      }
      if (score_7.length>1) {
        plotList.add(new plot(brands[i], dayofyear, score_7));
        println("init: " + brands[i] + " x " + score_7.length + "\n");
      }
      if (score_7.length > 1) {
        checkVariability(i, score_7);
      }
    }
  }
  minDay = min(allDays);
  maxDay = max(allDays);
  maxScore = max(allScores);
  calculateNorm(daysCount, scoresTotal);
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

void checkVariability(int n, float sd_scores[]) {
  // 1. Calculate the mean:
  float mean = 0;
  for (int i=0; i<sd_scores.length; i++) {
    mean += sd_scores[i];
  }
  mean = mean/sd_scores.length;
  float temp[] = new float[sd_scores.length];
  // 2. For each number: subtract the mean and square the result:
  for (int i=0; i<sd_scores.length; i++) {
    temp[i] = sq(sd_scores[i]-mean);
  }
  // 3. Calculate the mean of those squared differences:
  mean = 0;
  for (int i=0; i<temp.length; i++) {
    mean += temp[i];
  }
  mean = mean/temp.length;
  // 4. Take the square root of that:
  float sd = sqrt(mean);
  if (sd > maxSD) {
    maxSD = sd;
    variableBrand = n;
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void calculateNorm(IntDict daysCount, FloatDict scoresTotal) {
  int normDays[] = new int[0];
  float normScores[] = new float[0];
  int[] keys = int(daysCount.keyArray());
  keys = sort(keys);
  monthDays = keys;
  for (int i=0; i<keys.length; i++) {
    float avgScore = scoresTotal.get(str(keys[i])) / daysCount.get(str(keys[i]));
    normDays = append(normDays, keys[i]);
    normScores = append(normScores, avgScore);
  }
  plotList.add(new plot("Norm", normDays, normScores));
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void drawDates() {
  noStroke();
  fill(150);
  textSize(10);
  textAlign(RIGHT);
  text(monthList[month-1], 2*margin-10, height-margin/2);
  for (int i=1; i<=monthDays.length; i++) {
    float xpos = map(i, 1, monthDays.length, 2*margin, width-2*margin);
    textAlign(CENTER);
    text(i, xpos, height-margin/2);
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void updateSelectedBrand() {
  for (int i=0; i<plotList.size(); i++) {
    if (mouseX>0 && mouseX<2*margin) {
      selectedBrand = int(map(mouseY, 0, height, 0, plotList.size()));
    }
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void updateHover() {
  for (int i=0; i<monthDays.length; i++) {
    if (mouseY>2*margin && mouseY<width-2*margin) {
      hoverDay = int(map(mouseX, 2*margin, width-2*margin, 0, monthDays.length-1));
    }
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void keyPressed() {
  if (key == '=' && selectedBrand<plotList.size()-1) {
    selectedBrand++;
  } else if (key == '-' && selectedBrand>0) {
    selectedBrand--;
  }
}