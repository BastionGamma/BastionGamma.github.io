

// TO DO
// - Include brand average score
// - Label 3 graphs
// - Query all data and filter for exploration

import de.bezier.data.sql.*;
import processing.pdf.*;


// mySQL Setup
MySQL msql;
String user = "root";
String pass = "";
String database = "L2";
String selectedBrand = "Baby\'s Only";
String query = "select brand, dayofyear(date), visibility_7, share_7, avg_normalized_inverted_rank_7 from baby_foods where brand=\"" + selectedBrand +"\"";

// Data
String brand[] = new String[0];
int day[] = new int[0];
float visibility[] = new float[0];
float share[] = new float[0];
float rank[] = new float[0];
IntDict brands = new IntDict();

// Draw
int margin = 50;
boolean record;

// - - - - - - - - - - - - - - - - - - - - -

void setup() {
  size(1600, 900); 
  fetchEntries();
}

// - - - - - - - - - - - - - - - - - - - - -

void draw() {
  if (record) {
    beginRecord(PDF, selectedBrand + ".pdf");
  }
  background(50);
  noStroke();
  fill(150);
  textSize(18);
  text(selectedBrand, margin, margin);
  drawChart(day, visibility, 1, color(200, 50, 50));
  drawChart(day, share, 2, color(50, 200, 50));
  drawChart(day, rank, 3, color(50, 50, 200));
  if (record) {
    endRecord();
    record = false;
    println("PDF Saved!");
  }
}