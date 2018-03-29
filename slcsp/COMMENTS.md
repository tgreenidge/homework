## Assumptions

Since the instructions state that Zip codes that have more than one rate area have ambiguous slcsp, I assumed that Zip codes that are shared by multiple states produce ambiguous slcsps as well. This assumption was made since the slcsp.csv file does not have a 'state' or 'county' column. Additionally, ambiguous slcsps(blanks) were added to the output file for Rate areas that were not included in the 'plans.csv' file.

## Running this program

The solution for this program uses Java 8. Please follow the the steps below to run this program.

* Download Java 8
* In the command line, run javac AddColumnToCsv.java
* Then run java AddColumnToCsv

## Output

The output for the slcsp.csv file may be found on the _slcspByZip.csv_ file.
