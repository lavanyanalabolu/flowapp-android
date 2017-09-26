package com.flow.andriod;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.SkipException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

import Flow.Objects.AndroidConstants;
import Flow.Objects.AndroidConstants.Flow;
import TestNGListeners.CustomListener;
import Utilities.AndroidApplicationFunctions;
import Utilities.AndroidUtil;
import Utilities.DriverUtil;
import Utilities.ExcelDataUtil;
import Utilities.HtmlReportUtil;
import Utilities.KeywordUtil;
import Utilities.LogUtil;
import Utilities.Utility;

@Test
@Listeners(CustomListener.class)
public class TC_Flowandriod_002 extends AndroidApplicationFunctions
{
	public static boolean status = false;
	public String testCaseID = getClass().getSimpleName();
	int row = 1;
	public static Class thisClass=TC_Flowandriod_001.class;
	public static String logging_step;
	static int retryCount=GetIntValue("retryCount");
	static int retryingNumber=1;
	
	
	public static boolean flag1=false; 
	/*@BeforeMethod
	public void beforeTest() throws Exception  {
		
	
		System.out.println("beforetest ended");
	}
	*/
	public void TestValidation() throws Exception{
		try{
			// invocationflag= true;
			Utility.initializeClassFields(getClass(),testCaseID);
			//isRun = ExcelDataUtil.getControls(suiteName, testCaseID);
			
			Utility.testData.setBrowser(CustomListener.browserName);
			logStep = Utility.testData.getTestCaseSummary();
			HtmlReportUtil.stepInfo(logStep);
			
       
			
			//login with subscriber credentials and check the ctachup functionality
			NavigateToLoginPage();
			allowPopup();
			LogintoTheApplication((FetchDatfromexcel("andriod", testCaseID, "subscriberUsername")),(FetchDatfromexcel("andriod", testCaseID, "subscriberPassword")));
			switchEnvironment();
			CreateNewTask((FetchDatfromexcel("andriod", testCaseID, "ProjectName")),(FetchDatfromexcel("andriod", testCaseID, "Taskname")));
			ClickToGotoCtchup();
			Assert.assertTrue(ClickonHowitworksSubscriber(FetchDatfromexcel("andriod", testCaseID, "tasknameAssigned")));
			//GoToAccountDetails();
			//LogoutOfapplication();
			
			
			status= true;
		}
		catch (SkipException skip) {
			Utility.testException = skip;
			throw skip;
		}
		
		catch (Exception e) {
			KeywordUtil.changeContext("NATIVE");
			if(retryCount>0)
			{
				//LogUtil.infoLog(thisClass,logging_step + "-FAIL ");
			    HtmlReportUtil.stepError(logging_step + "-FAIL");
				String imagePath = Utility.takeScreenshot(driver, testCaseID+"_"+ retryingNumber);
				Utility.testResult.setFailedScreenShotReference(imagePath);
				HtmlReportUtil.stepError(testCaseID,e);
				Utility.testException = e;
			    HtmlReportUtil.attachScreenshot(imagePath);
			    HtmlReportUtil.stepInfo("Trying to Rerun" + " "+testCaseID +" for " + retryingNumber + " time");
				retryCount--;
				retryingNumber++;
				LogUtil.infoLog(thisClass, "****************Waiting for " + GetIntValue("retryDelayTime") +" Secs before retrying.***********");
				executionDelay(GetIntValue("retryDelayTime"));
				LogUtil.errorLog(getClass().getSimpleName(),e.getCause().toString());
				executeStep(AndroidUtil.startActivity(Utility.GetValue("appPackage"),Utility.GetValue("appActivity")), getClass(), "Start Activity");
				TestValidation();
			
				
			}
			else
			{
			
			
			LogUtil.infoLog(thisClass,logging_step + "-FAIL ");
		    HtmlReportUtil.stepError(logging_step + "-FAIL");
			
			String imagePath = Utility.takeScreenshot(driver, testCaseID);
			Utility.testResult.setFailedScreenShotReference(imagePath);
			HtmlReportUtil.stepError(testCaseID, e);
			Utility.testException = e;
			HtmlReportUtil.attachScreenshot(imagePath);
			throw e;
			}
		
		}
	}

	
	}
	


