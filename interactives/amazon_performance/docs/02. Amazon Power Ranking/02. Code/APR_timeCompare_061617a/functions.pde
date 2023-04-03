
// - - - - - - - - - - - - - - - - - - - - - - - 
// FUNCTIONS
// - - - - - - - - - - - - - - - - - - - - - - - 

FloatDict fetchMetrics(int month, FloatDict scores) {
  String q = avgQuery.replace("MM", str(month));
  msql = new MySQL( this, "localhost", database, user, pass );
  if (msql.connect()) {
    msql.query(q);
    while ( msql.next () ) {
      if (!msql.getString(1).equals("NO DATA")) {
        scores.set(msql.getString(1), msql.getFloat(2));
      }
    }
  }
  println(scores);
  return scores;
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void drawDivider() {
  noFill();
  stroke(100);
  line(width/2, margin, width/2, height-margin);
  line(margin, height-margin, width-margin, height-margin);
  noStroke();
  fill(150);
  textAlign(CENTER);
  textSize(11);
  text(monthList[monthA-1] + " 2017", margin+(width-2*margin)/4, height-margin/2);
  text(monthList[monthB-1] + " 2017", width-margin-(width-2*margin)/4, height-margin/2);
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void drawData() {
  String brandsA[] = scoresA.keyArray();
  float valuesA[] = scoresA.valueArray();
  float valuesB[] = scoresB.valueArray();
  float maxScore;
  float maxGain = 0;
  float maxLoss = 0;
  String gainingBrand = "";
  String losingBrand = "";
  // Find Max
  if (max(valuesA) > max(valuesB)) {
    maxScore = max(valuesA);
  } else {
    maxScore = max(valuesB);
  }
  // Find Winner & Loser
  for (int i=0; i<brandsA.length; i++) {
    if (scoresB.hasKey(brandsA[i]) && scoresB.get(brandsA[i])-scoresA.get(brandsA[i]) > maxGain) {
      gainingBrand = brandsA[i];
      maxGain = scoresB.get(brandsA[i])-scoresA.get(brandsA[i]);
    }
    if (scoresB.hasKey(brandsA[i]) && scoresB.get(brandsA[i])-scoresA.get(brandsA[i]) < maxLoss) {
      losingBrand = brandsA[i];
      maxLoss = scoresB.get(brandsA[i])-scoresA.get(brandsA[i]);
    }
  }
  //println("WINNER: " + winningBrand + " = " + maxGain);
  //println("LOSER: " + losingBrand + " = " + maxLoss);
  // Draw Lines
  for (int i=0; i<brandsA.length; i++) {
    color c = color(100);
    if (scoresB.hasKey(brandsA[i])) {
      float xPosA = margin+(width-2*margin)/4;
      float xPosB = width-margin-(width-2*margin)/4;
      float yPosA = map(scoresA.get(brandsA[i]), 0, maxScore, height-margin, margin);
      float yPosB = map(scoresB.get(brandsA[i]), 0, maxScore, height-margin, margin);
      if (brandsA[i].equals(gainingBrand)) {
        c = color(0, 255, 0);
        fill(c);
        noStroke();
        textAlign(RIGHT);
        text(brandsA[i], xPosA-10, yPosA);
        textAlign(LEFT);
        String percentFormat = "+" + int(1000*(maxGain/scoresA.get(brandsA[i])))/10.0 + "%";
        String deltaFormat = "+" + int(100*(maxGain/scoresA.get(brandsA[i])))/100.0 + "pts.";
        text(deltaFormat + " (" + percentFormat + ")", xPosB+10, yPosB);
      } else if (brandsA[i].equals(losingBrand)) {
        c = color(255, 0, 0);
        fill(c);
        noStroke();
        textAlign(RIGHT);
        text(brandsA[i], xPosA-10, yPosA);
        textAlign(LEFT);
        String percentFormat = int(1000*(maxLoss/scoresA.get(brandsA[i])))/10.0 + "%";
        String deltaFormat = int(100*(maxLoss/scoresA.get(brandsA[i])))/100.0 + "pts.";
        text(deltaFormat + " (" + percentFormat + ")", xPosB+10, yPosB);
      } 
      if (i==selectedBrand) {
        c = color(255);
        fill(c);
        noStroke();
        textAlign(RIGHT);
        text(brandsA[i], xPosA-10, yPosA);
        textAlign(LEFT);
        float delta = scoresB.get(brandsA[i])-scoresA.get(brandsA[i]);
        String percentFormat;
        String deltaFormat;
        if (delta > 0) {
          percentFormat = "+" + int(1000*(delta/scoresA.get(brandsA[i])))/10.0 + "%";
          deltaFormat = "+" + int(100*delta)/100.0 + "pts.";
        } else {
          percentFormat = int(1000*(delta/scoresA.get(brandsA[i])))/10.0 + "%";
          deltaFormat = int(100*delta)/100.0 + "pts.";
        }
        text(deltaFormat + " (" + percentFormat + ")", xPosB+10, yPosB);

        // HOVER A
        noStroke();
        fill(20);
        rectMode(CENTER);
        rect(xPosA, yPosA-24, 50, 25, 5);
        triangle(xPosA, yPosA-4, xPosA-10, yPosA-14, xPosA+10, yPosA-14);
        fill(255);
        textAlign(CENTER);
        text(scoresA.get(brandsA[i]), xPosA, yPosA-20);

        // HOVER B
        noStroke();
        fill(20);
        rectMode(CENTER);
        rect(xPosB, yPosB-24, 50, 25, 5);
        triangle(xPosB, yPosB-4, xPosB-10, yPosB-14, xPosB+10, yPosB-14);
        fill(255);
        textAlign(CENTER);
        text(scoresB.get(brandsA[i]), xPosB, yPosB-20);
        
      } 
      noStroke();
      fill(c);
      ellipse(xPosA, yPosA, markerSize, markerSize);
      ellipse(xPosB, yPosB, markerSize, markerSize);
      noFill();
      stroke(c);
      line(xPosA, yPosA, xPosB, yPosB);
    }
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void updateSelectedBrand() {
  for (int i=0; i<scoresA.size(); i++) {
    selectedBrand = int(map(mouseY, margin, height-margin, 0, scoresA.size()));
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void startPrint() {
  if (record) {
    beginRecord(PDF, "####.pdf");
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void endPrint() {
  if (record) {
    endRecord();
    record = false;
    println("PDF Saved!");
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void keyPressed() {
  if (key == 'p') {
    record = true;
  }
}