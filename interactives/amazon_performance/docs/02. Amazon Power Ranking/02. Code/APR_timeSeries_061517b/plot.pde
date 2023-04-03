// - - - - - - - - - - - - - - - - - - - - - - - 
// PLOT
// - - - - - - - - - - - - - - - - - - - - - - - 

class plot {
  String brand;
  int days[];
  float scores[];

  plot(String brand_, int days_[], float scores_[]) {
    brand = brand_.replace("\\", "");
    days = days_;
    scores = scores_;
  }

  void display() {
    noStroke();
    textSize(12);
    float textXpos1 = map(days[0], minDay, maxDay, 2*margin, width-2*margin)-10;
    float textYpos1 = map(scores[0], 0, maxScore, height-margin, margin)+3;
    float textXpos2 = map(days[days.length-1], minDay, maxDay, 2*margin, width-2*margin)+10;
    float textYpos2 = map(scores[scores.length-1], 0, maxScore, height-margin, margin)+3;
    if (brand.equals(brands[selectedBrand])) { // Selected
      fill(255);
      textAlign(RIGHT);
      text(brand, textXpos1, textYpos1);
    } 
    if (brand.equals(brands[0])) { // Top
      fill(255, 240, 0);
      textAlign(RIGHT);
      text(brand, textXpos1, textYpos1);
    } 
    if (brand.equals(brands[winningBrand])) { // Winning
      fill(80, 180, 80);
      textAlign(RIGHT);
      text(brand, textXpos1, textYpos1);
      textAlign(LEFT);
      text("+" + int(1000*maxWin)/1000.0, textXpos2, textYpos2);
    } 
    if (brand.equals(brands[losingBrand])) { // Losing
      fill(255, 25, 70);
      textAlign(RIGHT);
      text(brand, textXpos1, textYpos1);
      textAlign(LEFT);
      text(int(1000*maxLose)/1000.0, textXpos2, textYpos2);
    } 
    if (brand.equals("Norm")) { // Norm
      fill(150);
      textAlign(RIGHT);
      text("Norm", 2*margin-10, textYpos1);
    } 
    if (brand.equals(brands[variableBrand])) { // Most Variable
      if (!brands[variableBrand].equals(brands[losingBrand]) && !brands[variableBrand].equals(brands[winningBrand])) {
        fill(0, 174, 239);
        textAlign(RIGHT);
        text(brand, textXpos1, textYpos1);
        textAlign(LEFT);
        text("Most Variable\nSD: " + int(1000*maxSD)/1000.0, textXpos2, textYpos2);
      }
    }
    if (brand.equals(brands[variableBrand]) && brands[variableBrand].equals(brands[losingBrand])) { // Most Variable matching Biggest Loser
      fill(0, 174, 239);
      textAlign(LEFT);
      text("Most Variable\nSD: " + int(1000*maxSD)/1000.0, textXpos2, textYpos2+20);
    }
    if (brand.equals(brands[variableBrand]) && brands[variableBrand].equals(brands[winningBrand])) { // Most Variable matching Biggest Winner
      fill(0, 174, 239);
      textAlign(LEFT);
      text("Most Variable\nSD: " + int(1000*maxSD)/1000.0, textXpos2, textYpos2+20);
    }
    beginShape();
    for (int i=0; i<days.length; i++) {
      float xPos = map(days[i], minDay, maxDay, 2*margin, width-2*margin);
      float yPos = map(scores[i], 0, maxScore, height-margin, margin);
      noFill();
      if (brand.equals(brands[selectedBrand])) {
        stroke(255);
        strokeWeight(2);
      } else if (brand.equals(brands[0])) {
        stroke(255, 240, 0);
        strokeWeight(1);
      } else if (brand.equals(brands[winningBrand])) {
        stroke(80, 180, 80);
        strokeWeight(1);
      } else if (brand.equals(brands[losingBrand])) {
        stroke(255, 25, 70);
        strokeWeight(1);
      } else if (brand.equals(brands[variableBrand])) {
        stroke(0, 174, 239);
        strokeWeight(1);
      } else if (brand.equals("Norm")) {
        stroke(150);
        strokeWeight(1);
      } else {
        noStroke();
      }
      ellipse(xPos, yPos, 2, 2);
      if (i<days.length-1 && days[i+1] != days[i]+1) {
        vertex(xPos, yPos);
        vertex(xPos, height-margin);
        endShape();
        beginShape();
      } else if (i>1 && days[i-1] != days[i]-1) {
        beginShape();
        vertex(xPos, height-margin);
        vertex(xPos, yPos);
      } else if (i==0 && xPos!=2*margin) {
        vertex(xPos, height-margin);
        vertex(xPos, yPos);
      } else if (i==days.length-1 && xPos!=width-2*margin) {
        vertex(xPos, yPos);
        vertex(xPos, height-margin);
      }
      vertex(xPos, yPos);
    }
    endShape();
    // Hover
    for (int i=0; i<days.length; i++) {
      float xPos = map(days[i], minDay, maxDay, 2*margin, width-2*margin);
      float yPos = map(scores[i], 0, maxScore, height-margin, margin);
      // Hover
      if (days[i]-minDay==hoverDay) {
        if (brand.equals(brands[selectedBrand]) || brand.equals(brands[0]) || brand.equals(brands[winningBrand]) || brand.equals(brands[losingBrand]) || brand.equals("Norm") || brand.equals(brands[variableBrand])) {
          noStroke();
          fill(20);
          rectMode(CENTER);
          rect(xPos, yPos-24, 50, 25, 5);
          triangle(xPos, yPos-4, xPos-10, yPos-14, xPos+10, yPos-14);
          fill(255);
          textAlign(CENTER);
          text(scores[i], xPos, yPos-20);
        }
      }
    }
  }
}