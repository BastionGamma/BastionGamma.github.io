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
    if (brand.equals(brands[selectedBrand])) { // Selected
      fill(255);
      textAlign(RIGHT);
      text(brand, 2*margin-5, map(scores[0], 0, maxScore, height-2*margin, margin)+3);
    } else if (brand.equals(brands[0])) { // Top
      fill(255, 240, 0);
      textAlign(RIGHT);
      text(brand, 2*margin-5, map(scores[0], 0, maxScore, height-2*margin, margin)+3);
    } else if (brand.equals(brands[winningBrand])) { // Winning
      fill(80, 180, 80);
      textAlign(RIGHT);
      text(brand, 2*margin-5, map(scores[0], 0, maxScore, height-2*margin, margin)+3);
      textAlign(LEFT);
      text("+" + maxWin, width-2*margin+5, map(scores[scores.length-1], 0, maxScore, height-margin, margin)+3);
    } else if (brand.equals(brands[losingBrand])) { // Losing
      fill(255, 25, 70);
      textAlign(RIGHT);
      text(brand, 2*margin-5, map(scores[0], 0, maxScore, height-2*margin, margin)+3);
      textAlign(LEFT);
      text(maxLose, width-2*margin+5, map(scores[scores.length-1], 0, maxScore, height-margin, margin)+3);
    }
    beginShape();
    for (int i=0; i<days.length; i++) {
      float xPos = map(days[i], minDay, maxDay, 2*margin, width-2*margin);
      float yPos = map(scores[i], 0, maxScore, height-margin, margin);
      noFill();
      if (brand.equals(brands[selectedBrand])) {
        stroke(255);
      } else if (brand.equals(brands[0])) {
        stroke(255, 240, 0);
      } else if (brand.equals(brands[winningBrand])) {
        stroke(80, 180, 80);
      } else if (brand.equals(brands[losingBrand])) {
        stroke(255, 25, 70);
      } else {
        noStroke();
      }
      curveVertex(xPos, yPos);
    }
    endShape();
  }
}