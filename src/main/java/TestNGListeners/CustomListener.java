package TestNGListeners;

import java.io.IOException;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import org.testng.IInvokedMethod;
import org.testng.IInvokedMethodListener;
import org.testng.ISuite;
import org.testng.ISuiteListener;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

import Utilities.DriverUtil;
import Utilities.ExcelDataUtil;
import Utilities.HtmlReportUtil;
import Utilities.KeywordUtil;
import Utilities.LogUtil;
import Utilities.Utility;
import Utilities.sendMail;

	
	 public class CustomListener extends Utility implements  ITestListener, ISuiteListener, IInvokedMethodListener {
		public static String browserName = null;
		//public static boolean status = false;
		public static Date startTime, endTime;
		public static long seconds;
		public static String platformName = null;
		public static boolean isRun;
		public static String suiteName = Utility.GetValue("suiteName");
		private static boolean wasCreatedOnceBefore = false;
	    private boolean isSecondInstance = false;
	    private boolean isOnStartSecondTime = false;
	    private boolean isOnFinishSecondTime = false;
	    private Set<Integer> invokedMethodHashes = new HashSet<Integer>();
		
		
		public void onStart(ISuite suite) {
		
			System.out.println("in onstart");
			Utility.checkFileOpen();
	
	   if (driver == null) {
		   System.out.println("in onstart driver");
		   try {
				LogUtil.infoLog(getClass(), "*********************New Suite Started*********************");
			    platformName=ExcelDataUtil.getColumnValue(System.getProperty("user.dir")+Utility.GetValue("AutomationControlExcelPath"),"Platform(IOS,Android)", "Platform",1);
				   System.out.println("after onstart driver");
			    //platformName=ExcelDataUtil.getColumnValue("C:\\Users\\Lavanya\\Desktop\\flowapp-android\\src\\main\\resources\\ExcelFiles\\AutomationControlSheet.xls","Platform(IOS,Android)", "Platform",1);
				logStep="Platform Name:-"+platformName;
			    LogUtil.infoLog(Utility.class, logStep );
			 
		      } catch (Exception e) {
		    	  
			   e.printStackTrace();
		   }
		   if(platformName.equals("Android"))
			   {
			   
			   browserName = ExcelDataUtil.getColumnValue(System.getProperty("user.dir")+Utility.GetValue("AutomationControlExcelPath"),"Browser(Browser,Chrome or N.A. [if running apps])", "Browsers",1);
			   System.out.println("after onstart driver");
			   //browserName = ExcelDataUtil.getColumnValue("C:\\Users\\Lavanya\\Desktop\\flowapp-android\\src\\main\\resources\\ExcelFiles\\AutomationControlSheet.xls","Browser(Browser,Chrome or N.A. [if running apps])", "Browsers",1);
			   if(browserName.equals("N.A."))
				   {
				}
			   }

		    else if(platformName.equals("IOS"))
		   
		    {
				   browserName = ExcelDataUtil.getColumnValue(System.getProperty("user.dir")+Utility.GetValue("AutomationControlExcelPath"),"Browser(Safari)", "Browsers",1);
				   if(browserName.equals("N.A.")){
						
				   }
		         }
			   
		   }
	   }
	   
		

   public void onFinish(ISuite suite) {
	    		
				HtmlReportUtil.tearDownReport();
		
		Utility.renameFile();
		System.out.println("Suite run has finished");
		try {
			if(Utility.GetValue("sendMail").equalsIgnoreCase("Y"))
			{
			sendMail.sendEmailToClient();
			}
		} catch (Exception e1) {
			e1.printStackTrace();
		}
	
		/*
		driver.closeApp();
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e1) {
			e1.printStackTrace();
		}
		
		driver.quit();*/
		
		if(CustomListener.platformName.equals("Android"))
		{
		try {
			
			Runtime.getRuntime().exec("taskkill /f /im node.exe");
			
		}
			
		 catch (IOException e) {
			 
			 e.printStackTrace();
		 }
		}
		LogUtil.infoLog(getClass(), "*********************Suite Ended*********************");
			
	}



	public void onTestStart(ITestResult result) {
		startTime = new Date();
		
		
	}
	
	
	public void onTestSuccess(ITestResult testResult) {
		
		endTime = new Date();
		seconds = (endTime.getTime()-startTime.getTime()) / 1000;
		LogUtil.infoLog(getClass().getSimpleName(), "Total Time taken in(seconds):" + seconds);
		Utility.testResult.setResultStatus("PASS");
		Utility.testResult.setTotalTimeTaken(seconds);
		ExcelDataUtil.updateTestResults(Utility.testData, Utility.testResult);
		HtmlReportUtil.endReport(true,Utility.testData.getTestCaseID());
	}



	public void onTestFailure(ITestResult testResult) {
			
			endTime = new Date();
			seconds = (endTime.getTime()-startTime.getTime()) / 1000;
			LogUtil.infoLog(getClass().getSimpleName(), "Total Time taken in(seconds):" + seconds);
			Utility.testResult.setResultStatus("FAIL");
			Utility.testResult.setTotalTimeTaken(seconds);
			Utility.testResult.setReasonForFailure(testResult.getThrowable().getMessage());
			LogUtil.errorLog(getClass().getSimpleName(), testResult.getThrowable().getMessage());
			ExcelDataUtil.updateTestResults(Utility.testData, Utility.testResult);
			HtmlReportUtil.endReport(false, Utility.testData.getTestCaseID());

	}
	
	


	public void onTestSkipped(ITestResult testResult)  {

		endTime = new Date();
		seconds = (endTime.getTime()-startTime.getTime()) / 1000;
		LogUtil.infoLog(getClass().getSimpleName(), "Test Skipped - Total Time taken in(seconds):" + seconds);
		Utility.testResult.setResultStatus("SKIPPED");
		Utility.testResult.setTotalTimeTaken(seconds);
		ExcelDataUtil.updateTestResults(Utility.testData, Utility.testResult);
		HtmlReportUtil.endReportSkipped(Utility.testData.getTestCaseID(), Utility.testException);
	}


	public void onTestFailedButWithinSuccessPercentage(ITestResult result) {
		
	}



	public void onStart(ITestContext context) {
		 
	
	}



	public void onFinish(ITestContext context) {
		
		
	}



	public void beforeInvocation(IInvokedMethod method, ITestResult testResult) {
		
			if (isSecondInstance) {
            return;
        }
        if (invokedMethodHashes.contains(method.hashCode())) {
            return;
        }
        invokedMethodHashes.add(method.hashCode());
		if(platformName.equalsIgnoreCase("Android")&&(browserName.equals("N.A.")))
		 {
			   System.out.println("in before invocation");
	 DriverUtil.getAndroidDriver(browserName);
		 }
else if(platformName.equalsIgnoreCase("IOS")&&(browserName.equals("N.A.")))
{
	 DriverUtil.getIOSDriver(browserName);
}
			
		
		/* i
		System.out.println("before invocztion ");
		*/
	}



	public void afterInvocation(IInvokedMethod method, ITestResult testResult) {
	if (isSecondInstance) {
            return;
        }
        if (!invokedMethodHashes.contains(method.hashCode())) {
            return;
        }
        invokedMethodHashes.remove(method.hashCode());
	//System.out.println("after invocztion");	
	//System.out.println("testCaseID is "+testCaseID);
	Utility.resettData();
	//LogUtil.infoLog(testCaseID,"");
	driver.closeApp();
	try{
		KeywordUtil.executionDelay(2000);

	}
		catch(InterruptedException e1) {
			  e1.printStackTrace();
		}
	    driver.quit();
	}
	}
