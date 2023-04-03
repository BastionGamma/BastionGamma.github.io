
// TO DO:
// - use rolling 30-day window to find top winner + loser
// - check days are being plotted in the right place
// - only show adjacent plots?

// DONE:
// - create index of all brands
// - for each brand initialize a graph object

// TERMINOLOGY
// Rank: The best rated product of the brand on that day
// Visibility: Does the brand have at least one product in the rankings on that day
// Real Estate: The number of products the brand has in the rankings divided by the total number of products in the rankings

// Libraries
import de.bezier.data.sql.*;
import processing.pdf.*;

// mySQL Setup
MySQL msql;
String user = "root";
String pass = "";
String database = "L2";
String table = "soda";
String query = "select brand, dayofyear(date), score_7 from " + table;
String queryRanks = "select brand, avg(distinct score_7) as s from " + table + " where score_7 is not null group by brand order by s desc";


// Data
IntDict brandList = new IntDict();
FloatDict brandRank = new FloatDict();
String brandRankArray[];
float brandRankValue[];
String brand[] = new String[0];
int dayofyear[] = new int[0];
float score_7[] = new float[0];
int minDay, maxDay;
float maxScore;
int brandIndex = 0;

// Rank Plot
ArrayList<plot> plotList;

// Draw
int margin = 50;
boolean record;
int markerSize = 4;

// - - - - - - - - - - - - - - - - - - - - -

void setup() {
  size(1600, 900); 
  fetchEntries();
  fetchRanks();
  buildPlots();
}

// - - - - - - - - - - - - - - - - - - - - -

void draw() {
  startPrint();
  background(50);
  for (int i=brandIndex; i<plotList.size(); i++) { 
    plotList.get(i).display();
  }
  endPrint();
}