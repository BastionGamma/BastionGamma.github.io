
// - - - - - - - - - - - - - - - - - - - - - - - 
// FUNCTIONS
// - - - - - - - - - - - - - - - - - - - - - - - 

void fetchEntries() {
  msql = new MySQL( this, "localhost", database, user, pass );
  if (msql.connect()) {
    msql.query(query);
    while ( msql.next () ) {
      brandList.add(msql.getString(1), 1);
      brand = append(brand, msql.getString(1));
      dayofyear = append(dayofyear, msql.getInt(2));
      score_7 = append(score_7, msql.getFloat(3));
    }
  }
  minDay = max(dayofyear);
  maxDay = min(dayofyear);
  maxScore = max(score_7);
}

// - - - - - - - - - - - - - - - - - - - - - - - 

void buildPlots() {
  plotList = new ArrayList<plot>();
  for (int i=0; i<brandList.size(); i++) {
    String[] brandKeys = brandList.keyArray();
    int[] brandCounts = brandList.valueArray();
    String brandData[][] = new String[max(brandCounts)][3];
    int count = 0;
    for (int n=0; n<score_7.length; n++) {
      if (brandKeys[i].equals(brand[n])) {
        brandData[count][0] = brand[n];
        brandData[count][1] = str(dayofyear[n]);
        brandData[count][2] = str(score_7[n]);
        count++;
      }
    }
    plotList.add(new plot(brandData));
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