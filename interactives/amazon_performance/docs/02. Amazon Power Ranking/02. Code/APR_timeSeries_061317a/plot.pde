// - - - - - - - - - - - - - - - - - - - - - - - 
// RANK PLOT
// - - - - - - - - - - - - - - - - - - - - - - - 

class plot {
  String data[][];

  plot(String data_[][]) {
    data = data_;
    println(data);
  }

  void display() {
    beginShape();
    for (int i=0; i<data.length; i++) {
      try {
        float xPos = map(int(data[i][1]), minDay, maxDay, margin, width-margin);
        float yPos = map(float(data[i][2]), 0, maxScore, margin, height-margin);
        noFill();
        stroke(150);
        vertex(xPos, yPos);
        //ellipse(xPos, yPos, markerSize, markerSize);
      } 
      catch(Exception e) {
      }
    }
    endShape();
  }
}