// - - - - - - - - - - - - - - - - - - - - - - - 
// RANK PLOT
// - - - - - - - - - - - - - - - - - - - - - - - 

class plot {
  String data[][];

  plot(String data_[][]) {
    data = data_;
  }

  void display() {
    beginShape();
    for (int i=0; i<data.length; i++) {
      try {
        float xPos = map(int(data[i][1]), minDay, maxDay, 2*margin, width-margin);
        float yPos = map(float(data[i][2]), 0, maxScore, height-margin, margin);
        noFill();
        if ( data[i][0].equals(brandRankArray[brandIndex]) ) {
          if (i==0) {
            noStroke();
            fill(255);
            textAlign(RIGHT);
            text(brandRankArray[brandIndex] + "\n" + brandRankValue[brandIndex], 2*margin-5, yPos);
          }
          stroke(255);
        } else {
          stroke(100);
        }
        curveVertex(xPos, yPos);
      } 
      catch(Exception e) {
      }
    }
    endShape();
  }
}