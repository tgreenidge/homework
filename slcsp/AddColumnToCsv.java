import java.util.*;
import java.io.*;

public class AddColumnToCsv {
    public static HashMap<String, HashSet<Double>> ratesByRateArea = new HashMap<>();

    public static HashMap< String, HashSet< String> > ratesAreaByZipCode = new HashMap<>();

    /**
    * This function creates lookup for the rates of Silver Plans in a rate area
    * */
    public static void createRatesLookupTablesForSilverPlansByRateArea (String plansFile) throws IOException {
        String line = "";

        //comma separator
        String delimeter =",";

        //rate area in a state
        String stateAndRateArea;

        //create Rates Lookup Table for rate areas
        try (BufferedReader plansBr = new BufferedReader ( new FileReader(plansFile) )) {
            while ((line = plansBr.readLine()) != null) {
                
                String[] plan = line.split(delimeter);
                
                if (plan[2].equals("Silver")) {
                    stateAndRateArea = plan[1] + "_" + plan[4];
                    try {
                        if (ratesByRateArea.get(stateAndRateArea) == null) {
                            ratesByRateArea.put(stateAndRateArea, new HashSet<Double>());
                        }
                        
                        ratesByRateArea.get(stateAndRateArea).add(Double.parseDouble(plan[3]));
                    } catch (NumberFormatException e) {
                        System.out.println(e.getMessage());
                    }
                } 
            }

            plansBr.close();
        } catch ( IOException e) {
            System.out.println(e.getMessage());
        }
    }

    /**
    * This function creates a mapping for the Zip code to the rates areas in
    * specific states
    * */
    public static void createRatesAreaLookupTableByZipCode (String zipsFile) throws IOException {
        String line = "";

        //comma separator
        String delimeter = ",";

        //rate area specific to state
        String stateAndRateArea;
        String zipCode;
        
        //create ZipCode Lookup Table
        try (BufferedReader zipsBr = new BufferedReader ( new FileReader(zipsFile) )) {
            while ((line = zipsBr.readLine()) != null) {
                
                String[] zip = line.split(delimeter);
                
                stateAndRateArea = zip[1] + "_" + zip[4];
                zipCode = zip[0];
                
                if (ratesAreaByZipCode.get(zipCode) == null) {
                    ratesAreaByZipCode.put(zipCode, new HashSet<String>());
                }

                ratesAreaByZipCode.get(zipCode).add(stateAndRateArea);
            }

            zipsBr.close();
        } catch ( IOException e) {
            System.out.println(e.getMessage());
        }
    }

    /**
    * This function outputs the slcsp to a file, given a file of zip codes.
    * The zip code is looked up to find the respective rate areas. 
    * If there is no ambiguity, the rate area is looked up, and the slcsp is 
    * determined and written to a file. For instances where a single rate area is * not found for a zip code, no slcsp is written to the file.
    * */
    public static void addColumnToCsv (String inputFile) throws IOException { 
        //comma separator
        String delimeter = ",";

        //line separator
        String lineSeparator = System.getProperty("line.separator"); 
       
        try{
            BufferedReader br = new BufferedReader(new  FileReader(inputFile));

            // writes to output file
            FileWriter fw = new FileWriter("slcspByZip.csv", false); 
            String line = "";
            
            //used to determine first line of file
            int i = 0; 

            while ((line = br.readLine()) != null) {
                //get Zip code from file
                String zipCode = line.split(delimeter)[0];
            
                //output line to be written to file
                String output = line;
                String slcsp = "";
                
                //ambiguous
                if (i == 0 || ratesAreaByZipCode.get(zipCode).size() > 1 || ratesAreaByZipCode.get(zipCode) == null) {
                    i++;
                } else {
                    //get first element of set
                    String rate_area = ratesAreaByZipCode.get(zipCode).stream().findFirst().get();

                    if (ratesByRateArea.get(rate_area) != null) {
                        slcsp += getSecondLowest(ratesByRateArea.get(rate_area));
                        output += slcsp;
                    }
                } 

                fw.write(output + lineSeparator); 
                fw.flush();
            }
            
            br.close();
            fw.close();
        } catch (Exception e){
            e.printStackTrace();
        }  
    }

    /**
    * This function gets the second lowest value from a set of numbers
    * */
    public static Double getSecondLowest( HashSet<Double> rates) {
        Double lowest; 
        Double secondLowest;
    
        Double temp = rates.stream().findFirst().get();
        
        // set lowest and second lowest to first element in the set
        lowest = temp;
        secondLowest = temp;

        for(Double nextRate: rates){
            if (nextRate < lowest){
                temp = lowest;
                lowest = nextRate;
                secondLowest = temp; 
            } else if (nextRate > lowest && nextRate < secondLowest || secondLowest.equals(lowest)) {
                secondLowest = nextRate;
            } 
        };

        return secondLowest;
    }

    public static void main(String[] args) {
        try {
            createRatesLookupTablesForSilverPlansByRateArea("plans.csv");
            createRatesAreaLookupTableByZipCode("zips.csv");
            addColumnToCsv("slcsp.csv");
        } catch( IOException e) {
            e.printStackTrace();
        }
    }

}