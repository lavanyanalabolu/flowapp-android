package suite.runner;

import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.testng.TestNG;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.testng.xml.XmlClass;
import org.testng.xml.XmlPackage;
import org.testng.xml.XmlSuite;
import org.testng.xml.XmlSuite.ParallelMode;
import org.testng.xml.XmlTest;
import Utilities.ExcelDataUtil;
//import utilities.ExcelDataUtil;
//import utilities.ExcelTestDataReader;
//import utilities.GlobalUtil;
//import utilities.TestConfig;
import Utilities.TestConfig;
//import utilities.ExcelTestDataReader;
//import utilities.GlobalUtil;

import org.testng.annotations.Test;


public class CustomSuiteRunner {
	public static String platformFlag="";
	
	@Test
	//(dataProvider="getExcelTestData")
	public static void suiteRunner() {
		List<TestConfig> listOfTestConfigs = ExcelDataUtil.getSuitesToRun();
		System.out.println(listOfTestConfigs.size());
		//Create A XML Suites based on List of 
				List<XmlSuite> suites = new ArrayList<XmlSuite>();
		for (TestConfig tc : listOfTestConfigs)
		{
			//Create a suite with name from Excel
			XmlSuite suite = new XmlSuite();
			suite.setName(tc.getSuiteName());
			System.out.println("\nSuite name: " + tc.getSuiteName());	
			

			//Set Suite parameters
			Map<String,String> parameters = new HashMap<>();
			parameters.put("Platform", tc.getPlatformName());
			System.out.println("plaform name: " + tc.getPlatformName());
			
			//Set Suite Parameter		
			suite.setParameters(parameters);
			
			//Add a test name for Current suite
			XmlTest test = new XmlTest(suite);
			test.setName(tc.getSuiteName() +"-Tests");
			
             if( tc.getPlatformName().equalsIgnoreCase("android"))
              {
            	  platformFlag="com.flow.andriod";
		}
		else if(tc.getPlatformName().equalsIgnoreCase("ios"))
		{ 
			
			platformFlag="com.flow.ios.tests";
		
		}
            //Get Package where all tests resides
  			XmlPackage xmlpkg = new XmlPackage(platformFlag);
  			
			//Get All classes from that package
			List<XmlClass> testClasses = new ArrayList<XmlClass>();
			
			//Get all the test classes from package
			testClasses=xmlpkg.getXmlClasses();
			
			
			//Create a List of valid test classes as per excel test list
			List<XmlClass> validtestClasses = new ArrayList<XmlClass>();
			
			for(XmlClass xmlTestClass : testClasses){
				
				//Get a List of Valid test
				for (String testName : tc.getTestsList()){
					
					if(xmlTestClass.getName().contains(testName))
					{
						validtestClasses.add(xmlTestClass);
					}
										
				}//End for Test list 
				
			}//End for test class list
			
			
			//Set all classes for test 
			test.setXmlClasses(validtestClasses) ;

			System.out.println("Suite Id: " + tc.getSuiteId());
			
			
			Iterator<String> tcIt = tc.getTestsList().iterator();
			
			System.out.println("Enabled Tests # "+tc.getTestsList().size() );
			
			while (tcIt.hasNext())
			{
				String testId = (String) tcIt.next();
				System.out.print(" |" +testId + "|");
				
			}
			System.out.println("\n---------------------------------------------------------");
			//suite.addTest(test);
			
			suites.add(suite);
			
			
		}//End Loop
		
		System.out.println("Suite files are created.....");
		System.out.println("Total suites are : "+suites.size() );
	//	GlobalUtil.setTotalSuites(suites.size());
		
		System.out.println("Suite names: ");
		for(XmlSuite mysuite:suites){
			
			System.out.print(" |" +mysuite.getName()+"|");
			
			
		}
		
		//Run TestNg Suites
		
		TestNG testNgRun = new TestNG();
		//Set suite
		testNgRun.setXmlSuites(suites);
		
		testNgRun.initializeSuitesAndJarFile();
		
		//testNgRun.setParallel(XmlSuite.ParallelMode.CLASSES);
		
		//Run 
		
		System.out.println("before run");
		testNgRun.run();
			
	}
	/*
	@DataProvider
	public Iterator<Object[]> getExcelTestData() 
	{
		ExcelTestDataReader excelReader = new ExcelTestDataReader();
		final LinkedList<Object[]> dataBeans = excelReader.getRowDataMap("C:\\Framework\\src\\test\\resources\\ExcelFiles\\KatalystTestData.xlsx","Credentials");
		return dataBeans.iterator();
	}
*/

	
}
