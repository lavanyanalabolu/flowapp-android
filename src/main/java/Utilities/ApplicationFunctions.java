package Utilities;


import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.testng.Assert;

import Flow.Objects.IOSConstants;
import Flow.Objects.IOSConstants.Cloudfm;
import Flow.Objects.IOSConstants.Common;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import io.appium.java_client.TouchAction;

public class ApplicationFunctions extends KeywordUtil {

	public static String logging_step;
	public static int highWait = 5000;
	public static int medWait = 100;
	public static int minWait = 100;
	public static int appLaunchWait = 2000;


	public void loginToApplication(String mobilenumber,String password) throws Exception {

		try{
			executionDelay(appLaunchWait);
			driver.switchTo().alert().accept();
		}
		catch (Exception e) {
			System.out.println("No alert found so skipped the accept alert");
		}

		executionDelay(appLaunchWait);
		
		clearInput(Cloudfm.input_mobileNo, IOSConstants.Common.type_xpath);
		logging_step="Click on Sign in button beofre writing the credentials";
		executeStep(click(Cloudfm.btn_signIn, IOSConstants.Common.type_id), getClass(), logging_step);
		if(isWebElementPresent(Cloudfm.input_mobileNo, IOSConstants.Common.type_xpath))
		logging_step="Write Mobile Number of the User";
		executeStep(writeInInput(Cloudfm.input_mobileNo, IOSConstants.Common.type_xpath, mobilenumber),getClass(),logging_step);
		logging_step="Write Password of the User";
		executeStep(writeInInput(Cloudfm.input_password, IOSConstants.Common.type_xpath, password),getClass(),logging_step);	
		logging_step="Click on Sign in button";
		executeStep(click(Cloudfm.btn_signIn, IOSConstants.Common.type_id), getClass(), logging_step);
		executionDelay(2000);
		//executionDelay(highWait);
		
		/*if(isWebElementVisible("I Agree", IOSConstants.Common.type_name)){
			logging_step="Click on I agree button";
			executeStep(click("I Agree", IOSConstants.Common.type_name), getClass(), logging_step);
			executionDelay(medWait);
		}*/
	}

	public void downloadClientCodes() throws Exception{		
		logging_step="Click on Clients button";
		executeStep(click(Cloudfm.btn_Clients, IOSConstants.Common.type_xpath), getClass(), logging_step);
		executionDelay(1000);
		
		logging_step="Click on demo button to Download QR codes";
		executeStep(click(Cloudfm.img_demo, IOSConstants.Common.type_xpath), getClass(), logging_step);
		executionDelay(highWait);
	}

	public void proceedToSelectBuilding() throws Exception{
		logging_step="Click Proceed Arrow Button";
		((WebElement) driver.findElements(By.xpath("//XCUIElementTypeButton")).get(4)).click();
		executeStep(true, getClass(), logging_step);
		executionDelay(appLaunchWait);
	}

	public void searchAndSelectBuilding(String sBuildingName) throws Exception{

		String BuildingName = sBuildingName;
		logging_step="Write Name of the Building in the filter";
		executeStep(writeInInput(Cloudfm.input_filter, IOSConstants.Common.type_xpath, BuildingName+"\n"),getClass(),logging_step);
		executionDelay(medWait);
		logging_step="Click on Searched building";
		executeStep(click("//XCUIElementTypeStaticText[contains(@value,'"+BuildingName+"')]", IOSConstants.Common.type_xpath), getClass(), logging_step);
		executionDelay(highWait);
	}

	public void checkInToBuilding() throws Exception{

		logging_step="Click on Continue button in Building CheckIn Screen";
		executeStep(click("Continue", IOSConstants.Common.type_name), getClass(), logging_step);
		executionDelay(minWait);

		logging_step="Click on Continue button in Confirm CheckIn screen";
		executeStep(click("Continue", IOSConstants.Common.type_name), getClass(), logging_step);
		executionDelay(minWait);

		logging_step="Click on Proceed button to start the tasks";
		executeStep(click("Proceed", IOSConstants.Common.type_name), getClass(), logging_step);
		executionDelay(highWait);
	}

	public void selectAndStartTasks() throws Exception{
		
		logging_step="Click on View Task button in Available Tasks Screen";
		//((WebElement) driver.findElements(By.name("View Task")).get(0)).click();
		executeStep(click("View Task", IOSConstants.Common.type_name), getClass(), logging_step);
		executeStep(true, getClass(), logging_step);
		executionDelay(4000);
		
		
		logging_step="Click on Begin PM button on Task INformation Screen";
		executeStep(click(Cloudfm.btn_begin, IOSConstants.Common.type_xpath), getClass(), logging_step);
		executionDelay(4000);
	}

	public void doOperationsOnTasks(String delegateTasks) throws Exception{

		String delegateAllAssets = delegateTasks;
		if(delegateAllAssets.equals("No")){
			logging_step="Swiping to Next screen without delegating the tasks";
			executeStep(true, getClass(), logging_step);
		}

		else{
			logging_step="click on Delegate The tasks";
			executeStep(click("Delegate All Assets", IOSConstants.Common.type_name), getClass(), logging_step);
			executionDelay(minWait);
			
			logging_step="click on continue to Delegate The tasks";
			executeStep(click("Confirm", IOSConstants.Common.type_name), getClass(), logging_step);
			executionDelay(minWait);
		}
		//swipe to next screen
		swipeHorizontal();
		executionDelay(medWait);

		//swipe on asset tags screen
		swipeHorizontal();
		executionDelay(medWait);


	}

	public void doOperationsOnClosingStatus(String status,String sAction) throws Exception{
		String isClosingStatus = status;
		String action = sAction;
		if(isClosingStatus.equalsIgnoreCase("Yes")){
			logging_step="Click on "+action+" on Closing Status";
			executeStep(click(action, IOSConstants.Common.type_name), getClass(), logging_step);
			executionDelay(medWait);
		}
		else{
			logging_step="Swiping to Next screen without Closing the Status";
			executeStep(true, getClass(), logging_step);
		}

		//swipe to closure notes screen
		swipeHorizontal();
		executionDelay(medWait);	
	}

	public void doOperationsOnClosureNotes(String sStatus,String sNotes) throws InterruptedException{
		String isNotes = sStatus;
		String notes = sNotes;

		if(isNotes.equalsIgnoreCase("Yes")){
			logging_step="Write Closure notes";
			executeStep(writeInInput("//XCUIElementTypeTextView[@value='Type task closure notes here (minimum 30 characters)']", IOSConstants.Common.type_xpath, notes+"\n"),getClass(),logging_step);
			executionDelay(minWait);
		}
		else{
			logging_step="Swiping to Next screen without Closue Notes";
			executeStep(true, getClass(), logging_step);
		}

		//swipe to Materials screen
		swipeHorizontal();
		executionDelay(medWait);
	}

	public void doOperationsOnMaterials(String sStatus,String sNotes) throws Exception{
		String isMaterialsUsed = sStatus;
		String notes = sNotes;

		if(isMaterialsUsed.equalsIgnoreCase("Yes")){
			//enter data in materials notes
			logging_step="Click Yes if Materials Used";
			executeStep(click("//XCUIElementTypeButton[@name='Yes']", IOSConstants.Common.type_xpath), getClass(), logging_step);
			executionDelay(minWait);

			logging_step="Write Closure notes";
			executeStep(writeInInput("//XCUIElementTypeTextView[@value='Type in the details of the materials used, including model and part numbers where relevant']", IOSConstants.Common.type_xpath, notes),getClass(),logging_step);
			executionDelay(minWait);
		}
		else{
			logging_step="Click No if Materials is selected";
			executeStep(click("//XCUIElementTypeButton[@name='No']", IOSConstants.Common.type_xpath), getClass(), logging_step);
		}

		//swipe to closing severity screen 
		swipeHorizontal();
		executionDelay(medWait);

		//swipe to signature screen
		swipeHorizontal();
		executionDelay(medWait);
	}

	public void doOperationsOnSignature(String Signature,String name) throws InterruptedException{
		String iSSignature = Signature;
		String Name = name;
		if(iSSignature.equalsIgnoreCase("Yes")){

			//click on get sinature
			logging_step="Click Get Signature";
			executeStep(click("Get Signature", IOSConstants.Common.type_name), getClass(), logging_step);
			executionDelay(medWait);

			logging_step="Enter the name of the persom siging";
			executeStep(writeInInput("//XCUIElementTypeTextField[@value='Enter the name of the person signing this document']", IOSConstants.Common.type_xpath, Name),getClass(),logging_step);	

			//hide keyboard
			driver.findElement(By.name("Done")).click();
			executionDelay(minWait);

			//sign the form
			new TouchAction(driver).tap(100, 300).perform();
			logging_step="Signing By the Person";
			executeStep(true, getClass(), logging_step);

			//click on save button
			logging_step="Click on Save to submit the Signature";
			executeStep(click("Save", IOSConstants.Common.type_name), getClass(), logging_step);
			executionDelay(appLaunchWait);

		}
		else{
			logging_step="Skiping the Signature";
			executeStep(true, getClass(), logging_step);
		}

		//swipe to next Finish task Screen		
		swipeHorizontal();
		executionDelay(medWait);
	}

	private String[] getFinalStatuses(){

		List<MobileElement> elements = driver.findElements(By.xpath("//XCUIElementTypeStaticText[contains(@name,'Incomplete actions are shown in red')]/../following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeOther"));
		String[] statuses = new String[elements.size()];
		int counter = 0;
		for (Iterator iterator = elements.iterator(); iterator.hasNext();) {
			MobileElement mobileElement = (MobileElement) iterator.next();
			String eachStatus = mobileElement.findElement(By.xpath("//XCUIElementTypeStaticText")).getAttribute("name");
			statuses[counter] = eachStatus;
			System.out.println(eachStatus);
			counter++;

		}
		return statuses;

	}

	public void doOperationsOnFinishTaskScreen(String sTaskFinished,String expStatus) throws InterruptedException{
		String expStatuses = expStatus;
		String isTaskFinished = sTaskFinished;
		boolean tasksStatus = true;
		
		if(isTaskFinished.equalsIgnoreCase("No")) {
		//fail if the statues are not eaual
		//boolean check = Arrays.equals(getFinalStatuses(), expStatus.split(","));

		//if(isTaskFinished.equalsIgnoreCase("No") || !check){

			//if(!check){
				//tasksStatus = false;
			//}
			
			executionDelay(medWait);
			swipeHorizontal();
			executionDelay(medWait);

			logging_step="Click on Abandon task";
			executeStep(click("//XCUIElementTypeStaticText[@value='Abandon']", IOSConstants.Common.type_xpath), getClass(), logging_step);
			executionDelay(medWait);



			logging_step="Click on Abandon task";
			executeStep(click("Yes", IOSConstants.Common.type_name), getClass(), logging_step);
			executionDelay(highWait);
		}
		else{

			//click on save button
			logging_step="Click on Finish task to submit";
			executeStep(click("//XCUIElementTypeStaticText[@value='Finish Task']", IOSConstants.Common.type_xpath), getClass(), logging_step);
			executionDelay(highWait);


			///click on chekbox
			logging_step="Click on Check Box to confirm th einformations is relevant";
			executeStep(click("//XCUIElementTypeStaticText[@name='Please tick the box below to confirm']/../following-sibling::XCUIElementTypeOther[2]/XCUIElementTypeButton", IOSConstants.Common.type_xpath), getClass(), logging_step);

			//clikc on submit	
			logging_step="Click on Submit button on final screen";
			executeStep(click("//XCUIElementTypeStaticText[@value='Submit']", IOSConstants.Common.type_xpath), getClass(), logging_step);
			executionDelay(highWait);
		}

		//click om exit
		logging_step="Click on Exit to do RemoteScanOut";
		int size = driver.findElements(By.xpath("//XCUIElementTypeLink")).size();
		((WebElement) driver.findElements(By.xpath("//XCUIElementTypeLink")).get(size-1)).click();
		executeStep(true, getClass(), logging_step);
		executionDelay(medWait);

		//click on remote scanout
		logging_step="Click on RemoteScanout button on final screen";
		executeStep(click("Remote Scan Out", IOSConstants.Common.type_name), getClass(), logging_step);
		executionDelay(3000);

		//click on Checkout
		logging_step="Click on Check Out to Check Out from building";
		executeStep(click("Check Out", IOSConstants.Common.type_name), getClass(), logging_step);
		executionDelay(3000);
		
		if(!tasksStatus){
			logging_step="Expected Result is Not equal to Actual Result";
			executeStep(false, getClass(), logging_step);
		}
	}

	public static Boolean swipeHorizontal() throws InterruptedException{
		Boolean flag = false;
		Dimension size = driver.manage().window().getSize(); 
		int startx = (int) (size.width * 0.90);
		int endx = (int) (size.height * 0.10);
		int starty = size.width / 2;
		((AppiumDriver) driver).swipe(startx, starty, endx, starty, 3000);
		Thread.sleep(2000);
		flag = true;

		if(flag)
			return true;
		else
			return false;
	}

	public static boolean waitUntilVisible(By locator) throws Exception{
		int startTime = 0;
		int endTime = 30;
		boolean flag = false;

		for (startTime = 0; ; startTime++) {
			if (startTime > endTime){
				return  false;
			}
			try{
				int eleWidth = driver.findElement(locator).getSize().getWidth();
				if (eleWidth > 0){
					return true;
				}
			}
			catch (Exception e) {
				System.out.println("waiting element size is zero");
			}
			executionDelay(1000);
		}
	}

	public void doLogOut() throws InterruptedException
	{	
		logging_step="Click on Options button";
		executeStep(click("Options",Common.type_name), getClass(), logging_step);

		logging_step="Click on LogOut button";
		//System.out.println(driver.getPageSource());
		executeStep(click("Logout", Common.type_name), getClass(), logging_step);
		executionDelay(medWait);
	}
	//***************************************************************New Script Implementation***************************************************************
		public boolean GoToForgotPassword() throws Exception{	
			boolean flag=false;
			try{
				executionDelay(appLaunchWait);
				driver.switchTo().alert().accept();
			}
			catch (Exception e) {
				System.out.println("No alert found so skipped the accept alert");
			}
			executionDelay(appLaunchWait);
			if(isWebElementVisible(Cloudfm.btn_ForgotPassword, IOSConstants.Common.type_name)){
				logging_step="Click on Forgot Password button";
				executeStep(click(Cloudfm.btn_ForgotPassword, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(2000);
				logging_step="Verify Mobile Number input text field";
				executeStep(isWebElementVisible(Cloudfm.input_FgtPwd_mobileNo, IOSConstants.Common.type_name),getClass(),logging_step);
				logging_step="Verify Resend Password button";
				executeStep(isWebElementVisible(Cloudfm.btn_ResendPwd, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(2000);
				flag=true;	
			}return flag;
					
		}
		public boolean ClickResendPasswordButton()throws Exception{
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.btn_ResendPwd, IOSConstants.Common.type_name)){
				logging_step="Verify without entered vailded mobile number & Click on Resend Password button to check the forgot password functionality";
				executeStep(click(Cloudfm.btn_ResendPwd, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(5000);
				flag=true;	
			}return flag;
					
		}
		public boolean VerifyandClickResendPassword(String mobilenumber)throws Exception{
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.input_FgtPwd_mobileNo, IOSConstants.Common.type_name) && isWebElementVisible(Cloudfm.btn_ResendPwd, IOSConstants.Common.type_name)){
				logging_step="Entered a mobile number which is not registerd";
				executeStep(writeInInput(Cloudfm.input_FgtPwd_mobileNo, IOSConstants.Common.type_name,mobilenumber), getClass(), logging_step);
				logging_step="Click on Resend Password button";
				executeStep(click(Cloudfm.btn_ResendPwd, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(1000);
				flag=true;	
			}return flag;
					
		}
		public String CheckResentPinNumberPopup() throws Exception{	
			 String temp=null;
			if(isWebElementVisible(Cloudfm.Msg_ResentPinNumber, IOSConstants.Common.type_name)){
				logging_step="Verify Your Pin Number is Being Sent message on forgot password screen";
				executeStep(isWebElementVisible(Cloudfm.Msg_ResentPinNumber, IOSConstants.Common.type_name), getClass(), logging_step);
				temp=Gettext(Cloudfm.Msg_ResentPinNumber, IOSConstants.Common.type_name);
				executionDelay(2000);
			}
			return temp;
	}
		public String CheckDeactivatedPopup() throws Exception{	
			 String temp=null;
			 executionDelay(1000);
			if(isWebElementVisible(Cloudfm.msg_Userdeactivated, IOSConstants.Common.type_name)){
				logging_step="Verify the Deactivate message on forgot password screen";
				executeStep(isWebElementVisible(Cloudfm.msg_Userdeactivated, IOSConstants.Common.type_name), getClass(), logging_step);
				temp=Gettext(Cloudfm.msg_Userdeactivated, IOSConstants.Common.type_name);
				executionDelay(2000);
			}
			return temp;
	}
		public String CheckNotRecognisedPopup() throws Exception{	
			String temp=null;
			executionDelay(1000);
			if(isWebElementVisible(Cloudfm.msg_NotRecognised, IOSConstants.Common.type_name)){
				logging_step="Verify the NotRecognised message on forgot password screen";
				executeStep(isWebElementVisible(Cloudfm.msg_NotRecognised, IOSConstants.Common.type_name), getClass(), logging_step);
				temp=Gettext(Cloudfm.msg_NotRecognised, IOSConstants.Common.type_name);
				executionDelay(2000);	
			}return temp;
					
		}
		public String CheckEngineername() throws Exception{	
			String temp=null;
			if(isWebElementPresent(Cloudfm.Engr_name, IOSConstants.Common.type_xpath)){
				logging_step="Verify Engineer name label";
				executeStep(isWebElementPresent(Cloudfm.Engr_name, IOSConstants.Common.type_xpath), getClass(), logging_step);
				temp=Gettext(Cloudfm.Engr_name, IOSConstants.Common.type_xpath);
				executionDelay(2000);	
			}return temp;
					
		}
		public boolean HomepageValidation() throws Exception{
			boolean flag=false;
			if(isWebElementPresent(Cloudfm.Engr_name, IOSConstants.Common.type_xpath)){
				executionDelay(2000);
				logging_step="Verify logo icon label";
				executeStep(isWebElementPresent(Cloudfm.logo_icon, IOSConstants.Common.type_xpath), getClass(), logging_step);
					
				logging_step="Verify Engineer label and Engineer name";
				executeStep(isWebElementVisible(Cloudfm.label_Engr, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Options button";
				executeStep(isWebElementVisible(Cloudfm.btn_options, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Agenda button";
				executeStep(isWebElementVisible(Cloudfm.btn_Agenda, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Clients button";
				executeStep(isWebElementPresent(Cloudfm.btn_Clients, IOSConstants.Common.type_xpath), getClass(), logging_step);
				logging_step="Verify Version button";	
				executeStep(isWebElementPresent(Cloudfm.btn_version, IOSConstants.Common.type_xpath), getClass(), logging_step);
				logging_step="Verify avatar button";
				executeStep(isWebElementPresent(Cloudfm.avatar_upload, IOSConstants.Common.type_xpath), getClass(), logging_step);
				logging_step="Verify QRScanner button";
				executeStep(isWebElementPresent(Cloudfm.QrScanner, IOSConstants.Common.type_xpath), getClass(), logging_step);
				logging_step="Verify Process button";
				executeStep(isWebElementPresent(Cloudfm.btn_process, IOSConstants.Common.type_xpath), getClass(), logging_step);
				//executeStep(click(Cloudfm.btn_process, IOSConstants.Common.type_xpath), getClass(), logging_step);
				//System.out.println(driver.getPageSource());
				executionDelay(2000);
				flag=true;	
			}return flag;
					
		}
		public boolean Iagree_scrn_validation() throws Exception {
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.btn_agree, IOSConstants.Common.type_name)){
				logging_step="Click on I agree button";
				executeStep(click(Cloudfm.btn_agree, IOSConstants.Common.type_name), getClass(), logging_step);
				//executionDelay(medWait);
				executionDelay(2000);
				flag= true;
				}
			return flag;
			}
		public boolean downloadClientCodes1() throws Exception{
			boolean flag=false;
			executionDelay(2000);
			if(isWebElementPresent(Cloudfm.img_demo, IOSConstants.Common.type_xpath)){
				logging_step="Click on demo button to Download QR codes";
				executeStep(click(Cloudfm.img_demo, IOSConstants.Common.type_xpath), getClass(), logging_step);
				executionDelay(2000);
				logging_step="Verify the Downloading QR Codes message";
				executeStep(isWebElementPresent(Cloudfm.msg_DownloadingQRcode, IOSConstants.Common.type_xpath), getClass(), logging_step);
				executionDelay(2000);
				flag=true;
				//executionDelay(highWait);
				} return flag;
			//}
			}
		public boolean VerifyClientName1() throws Exception{
			boolean flag=false;
			executionDelay(2000);
			if(isWebElementPresent(Cloudfm.img_demo, IOSConstants.Common.type_xpath)){
				logging_step="Click on demo button to Download QR codes";
				executeStep(click(Cloudfm.img_demo, IOSConstants.Common.type_xpath), getClass(), logging_step);
				executionDelay(2000);
				logging_step="Verify the Downloading QR Codes message";
				executeStep(isWebElementPresent(Cloudfm.msg_DownloadingQRcode, IOSConstants.Common.type_xpath), getClass(), logging_step);
				executionDelay(2000);
				flag=true;
				//executionDelay(highWait);
				} return flag;
			//}
			}
		
		public boolean Validatelogoicon() throws Exception{
			boolean flag= false;
				if(isWebElementPresent(Cloudfm.logo_icon, IOSConstants.Common.type_xpath)){
					logging_step="Verify logo icon and click on logo icon";
					executeStep(click(Cloudfm.logo_icon, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(5000);
					flag= true;
					}
				return flag;
				}
		public boolean AvatarIcon() throws Exception{
			boolean flag= false;
			if(isWebElementPresent(Cloudfm.avatar_upload, IOSConstants.Common.type_xpath)){
				logging_step="Verify Avatar Icon and click on Avatar Icon";
				executeStep(click(Cloudfm.avatar_upload, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(2000);			
					flag= true;
					}
				return flag;
				}
		public boolean Clientbutton() throws Exception{
			boolean flag= false;
			if(isWebElementPresent(Cloudfm.btn_Clients, IOSConstants.Common.type_xpath)){
					logging_step="Verify Clients button and click on Clients button";
					executeStep(click(Cloudfm.btn_Clients, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(2000);			
					flag= true;
					}
				return flag;
				}
		public boolean Versionbutton() throws Exception{
			boolean flag= false;
				if(isWebElementPresent(Cloudfm.btn_version, IOSConstants.Common.type_xpath)){
					logging_step="Verify Version button and click on version button";
					executeStep(click(Cloudfm.btn_version, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(2000);
					flag= true;
					}
				return flag;
				}
		public boolean Agendabutton() throws Exception{
			boolean flag= false;
				executionDelay(2000);
				if(isWebElementVisible(Cloudfm.btn_Agenda, IOSConstants.Common.type_name)){
					logging_step="Verify Agenda button and click on Agenda button";
					executeStep(click(Cloudfm.btn_Agenda, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(2000);
					flag= true;
					}
				return flag;
				}
		public boolean Optionsbutton() throws Exception{
			boolean flag= false;
				executionDelay(2000);
				if(isWebElementVisible(Cloudfm.btn_options, IOSConstants.Common.type_name)){
					logging_step="Verify Options button and click on Options button";
					executeStep(click(Cloudfm.btn_options, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(2000);
					flag= true;
					}
				return flag;
				}
		public boolean Clientlistscreen() throws Exception{
		 boolean flag= false;
		 		executionDelay(5000);
				if(isWebElementVisible(Cloudfm.label_Clientlist, IOSConstants.Common.type_name) && isWebElementPresent(Cloudfm.icon_refresh, IOSConstants.Common.type_xpath) )
					{
					logging_step="Verify Refresh Client list label button";
					executeStep(isWebElementVisible(Cloudfm.label_Clientlist, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(5000);
					logging_step="Verify Exit button";
					executeStep(isWebElementPresent(Cloudfm.btn_ClientExit, IOSConstants.Common.type_xpath), getClass(), logging_step);
					RefreshIcon();
					executionDelay(5000);
					flag= true;
					}
		return flag;
		}
		public boolean RefreshIcon() throws Exception{
			 boolean flag= false;
					if(isWebElementPresent(Cloudfm.icon_refresh, IOSConstants.Common.type_xpath))
						{
						logging_step="Verify Refersh icon and Click on Refresh icon";
						executeStep(click(Cloudfm.icon_refresh, IOSConstants.Common.type_xpath), getClass(), logging_step);
						flag= true;
						}
			return flag;
			}
		public boolean VerifyBackButton() throws Exception {
			boolean flag= false;
			if(isWebElementVisible(Cloudfm.btn_back, IOSConstants.Common.type_name)){
				logging_step="Verify Back button and click on back button";
				executeStep(click(Cloudfm.btn_back, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(2000);
				flag= true;	
				}
			return flag;
		
		}
		public boolean VerifyClientName() throws Exception {
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.label_clientname, IOSConstants.Common.type_name))
			{
				logging_step="Verify client label button";
				executeStep(isWebElementVisible(Cloudfm.label_clientname, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify client name";
				executeStep(isWebElementPresent(Cloudfm.clientname, IOSConstants.Common.type_xpath), getClass(), logging_step);
				executionDelay(2000);
				flag=true;
		}
				
		return flag;
		}
		public boolean Settingsbutton() throws Exception{
			boolean flag=false;
				executionDelay(2000);
				if(isWebElementVisible(Cloudfm.btn_Settings, IOSConstants.Common.type_name)){
					logging_step="Verify Settings button and click on Settings button";
					executeStep(click(Cloudfm.btn_Settings, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(2000);
					flag=true;
					}
				return flag;
				}
		public boolean Exitbutton() throws Exception{
			boolean flag=false;
				executionDelay(2000);
				if(isWebElementVisible(Cloudfm.btn_Exit, IOSConstants.Common.type_name)){
					logging_step="Verify Exit button and click on Exit button";
					executeStep(click(Cloudfm.btn_Exit, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(2000);
					flag=true;
					}
				return flag;
				}
		public boolean VerifyVehicleOdometerField() throws Exception{
			boolean flag=false;
				executionDelay(2000);
				if(isWebElementPresent(Cloudfm.label_VehicleOdometer, IOSConstants.Common.type_xpath) && isWebElementPresent(Cloudfm.txtfield_VehicleOdometer, IOSConstants.Common.type_xpath)){
					logging_step="Verify Vehicle Odometer name label";
					executeStep(isWebElementPresent(Cloudfm.label_VehicleOdometer, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(2000);
					logging_step="Verify Vehicle Odometer input text field";
					executeStep(isWebElementPresent(Cloudfm.txtfield_VehicleOdometer, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(2000);
					flag=true;
					}
				return flag;
				}
		public boolean VerifyElementsAgendaScreen() throws Exception{
			boolean flag=false;
			if(isWebElementPresent(Cloudfm.Engr_name, IOSConstants.Common.type_xpath)){
				executionDelay(2000);
					logging_step="Verify Begin/End day label";
					executeStep(isWebElementVisible(Cloudfm.label_BeginDay_EndDay, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(2000);
					logging_step="Verify Avatar Image";
					executeStep(isWebElementVisible(Cloudfm.avatar_Image, IOSConstants.Common.type_xpath), getClass(), logging_step);
					logging_step="Verify Engineer name label";
					executeStep(isWebElementPresent(Cloudfm.Engr_name, IOSConstants.Common.type_xpath), getClass(), logging_step);
/*					logging_step="Verify Begin day button";
					executeStep(isWebElementVisible(Cloudfm.btn_Beginday, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(2000)*/;
					logging_step="Verify Timesheet button";
					executeStep(isWebElementPresent(Cloudfm.link_Timesheet, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(2000);
					logging_step="Verify Next button";
					executeStep(isWebElementPresent(Cloudfm.btn_Next, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(2000);
					logging_step="Verify Exit button";
					executeStep(isWebElementVisible(Cloudfm.btn_Exit, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(2000);
					flag=true;
					}
				return flag;
	}
		public boolean VerifyVehicleOdometer(String Value) throws Exception{
			boolean flag=false;
			if(isWebElementPresent(Cloudfm.txtfield_VehicleOdometer, IOSConstants.Common.type_xpath)){
				logging_step="Verify Vehicle Odometer input text field";
				executeStep(writeInInput(Cloudfm.txtfield_VehicleOdometer, IOSConstants.Common.type_xpath,Value), getClass(), logging_step);
				executionDelay(2000);

					flag=true;
					}
				return flag;
	}
		public boolean VerifyBegindayButton() throws Exception{
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.btn_Beginday, IOSConstants.Common.type_name)){
				logging_step="Verify Begin day button and click Beging day button";
				executeStep(click(Cloudfm.btn_Beginday, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(2000);
					flag=true;
					}
				return flag;
	}
		public boolean VerifyStartdayMsg() throws Exception{
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.Msg_Startday, IOSConstants.Common.type_name)){
				logging_step="Verify Starting Day Message";
				executeStep(isWebElementVisible(Cloudfm.Msg_Startday, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(5000);
				logging_step="Verify label Day Start";
				executeStep(isWebElementVisible(Cloudfm.label_DayStart, IOSConstants.Common.type_name), getClass(), logging_step);
					flag=true;
					}
				return flag;
	}
		public void VerifyBeginDate() throws Exception{
			String text=null;
			if(isWebElementPresent(Cloudfm.label_StartDate_Time, IOSConstants.Common.type_xpath)){
			logging_step="Verify label Start day Date and Time";
			executeStep(isWebElementPresent(Cloudfm.label_StartDate_Time, IOSConstants.Common.type_xpath), getClass(), logging_step);
			text=Gettext(Cloudfm.label_StartDate_Time, IOSConstants.Common.type_xpath);
			//System.out.println("Device Begin Day Date & Time: "+text);
			Assert.assertTrue(text.contains(GetCurrentDate(Cloudfm.label_StartDate_Time, IOSConstants.Common.type_xpath)));
			System.out.println("Actual Begin Date: "+text+" And Current Date: "+GetCurrentDate(Cloudfm.label_StartDate_Time, IOSConstants.Common.type_xpath)+" is matched");
			
			}
				//return text;
	}
		public boolean VerifyEndDayButton() throws Exception{
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.btn_Endday, IOSConstants.Common.type_name)){
				logging_step="Verify End day button and click on End day button";
				executeStep(click(Cloudfm.btn_Endday, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(2000);
					flag=true;
					}
				return flag;
	}
		public boolean VerifyEndDayMsg() throws Exception{
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.Msg_Endday, IOSConstants.Common.type_name)){
				logging_step="Verify Ending Day Message";
				executeStep(isWebElementVisible(Cloudfm.Msg_Endday, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(5000);
				logging_step="Verify label Day End";
				executeStep(isWebElementVisible(Cloudfm.label_DayEnd, IOSConstants.Common.type_name), getClass(), logging_step);
					flag=true;
					}
				return flag;
	}
		public void VerifyEndDate() throws Exception{
			String text=null;
			if(isWebElementPresent(Cloudfm.label_EndDate_Time, IOSConstants.Common.type_xpath)){
				logging_step="Verify label End day Date and Time";
				executeStep(isWebElementPresent(Cloudfm.label_EndDate_Time, IOSConstants.Common.type_xpath), getClass(), logging_step);
				text=Gettext(Cloudfm.label_EndDate_Time, IOSConstants.Common.type_xpath);
				//System.out.println("Device End Day Date & Time: "+text);
				Assert.assertTrue(text.contains(GetCurrentDate(Cloudfm.label_EndDate_Time, IOSConstants.Common.type_xpath)));
				System.out.println("Actual End Date: "+text+" And Current Date: "+GetCurrentDate(Cloudfm.label_StartDate_Time, IOSConstants.Common.type_xpath)+" is matched");
			/*if(text.contains(GetCurrentDate(Cloudfm.label_EndDate_Time, IOSConstants.Common.type_xpath))){
				System.out.println(text+" End Date & Current Date matched "+GetCurrentDate(Cloudfm.label_EndDate_Time, IOSConstants.Common.type_xpath));
			}*/
		}
				//return text;
	}
		public boolean VerifyDayMessage() throws Exception{
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.label_LongDay, IOSConstants.Common.type_name)){
				logging_step="Verify label Long Day-have a normally aspirated bevarage and relax!";
				executeStep(isWebElementVisible(Cloudfm.label_LongDay, IOSConstants.Common.type_name), getClass(), logging_step);
				flag=true;
			}
			else if(isWebElementVisible(Cloudfm.label_GoodDayWork, IOSConstants.Common.type_name)){
				logging_step="Verify label Good Day Work!";
				executeStep(isWebElementVisible(Cloudfm.label_GoodDayWork, IOSConstants.Common.type_name), getClass(), logging_step);
				flag=true;
			}
			else if(isWebElementVisible(Cloudfm.label_ShortDay, IOSConstants.Common.type_name)){
				logging_step="Verify label That was a short day!";
				executeStep(isWebElementVisible(Cloudfm.label_ShortDay, IOSConstants.Common.type_name), getClass(), logging_step);
				flag=true;
			}
			else {
				System.out.println("No Message was displayed on Begin/End Day Screen");
				flag=true;
			}
				return flag;	
	}
		public boolean VerifyStartNewDaybutton() throws Exception{
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.btn_StartNewDay, IOSConstants.Common.type_name)){
				executionDelay(5000);
				logging_step="Verify Start New Day button and click on Start New Day button";
				executeStep(click(Cloudfm.btn_StartNewDay, IOSConstants.Common.type_name), getClass(), logging_step);
				executionDelay(5000);
				logging_step="Verify loading data Message";
				executeStep(isWebElementVisible(Cloudfm.Msg_LoadingData, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Timesheet label";
				executeStep(isWebElementVisible(Cloudfm.label_Timesheet, IOSConstants.Common.type_name), getClass(), logging_step);

					flag=true;
					}
				return flag;
	}
		public boolean VerifyTimesheetbutton() throws Exception{
			boolean flag=false;
			if(isWebElementPresent(Cloudfm.btn_Timesheet, IOSConstants.Common.type_xpath)){
				executionDelay(5000);
				logging_step="Verify Timesheet button and click on Timesheet button";
				executeStep(click(Cloudfm.btn_Timesheet, IOSConstants.Common.type_xpath), getClass(), logging_step);
				executionDelay(5000);
				logging_step="Verify loading data Message";
				executeStep(isWebElementVisible(Cloudfm.Msg_LoadingData, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Timesheet label";
				executeStep(isWebElementVisible(Cloudfm.label_Timesheet, IOSConstants.Common.type_name), getClass(), logging_step);

					flag=true;
					}
				return flag;
	}
		public boolean VerifyTimesheetScreen() throws Exception{
			boolean flag=false;
			if(isWebElementVisible(Cloudfm.label_Timesheet, IOSConstants.Common.type_name)){
				executionDelay(5000);
				logging_step="Verify Timesheet Begin label";
				executeStep(isWebElementVisible(Cloudfm.label_BeginTimesheet, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Timesheet Begin Not Set label";
				executeStep(isWebElementPresent(Cloudfm.label_BeginNotset, IOSConstants.Common.type_xpath), getClass(), logging_step);
				logging_step="Verify Timesheet Begin Odo label";
				executeStep(isWebElementPresent(Cloudfm.label_OdoBeginTimesheet, IOSConstants.Common.type_xpath), getClass(), logging_step);
				logging_step="Verify Timesheet End label";
				executeStep(isWebElementVisible(Cloudfm.label_EndTimesheet, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Timesheet End Not Set label";
				executeStep(isWebElementPresent(Cloudfm.label_EndNotset, IOSConstants.Common.type_xpath), getClass(), logging_step);
				logging_step="Verify Timesheet End Odo label";
				executeStep(isWebElementPresent(Cloudfm.label_OdoEndTimesheet, IOSConstants.Common.type_xpath), getClass(), logging_step);				
				VerifyTimesheettableheaders();
				//System.out.println(driver.getPageSource());
				flag=true;
			}
		return flag;
	}
		public boolean VerifyTimesheetMondaylabel() throws Exception{
			boolean flag=false;String expected=GetMondayOfCurrentWeek();
			if(isWebElementPresent(Cloudfm.label_Monday, IOSConstants.Common.type_xpath)){
				logging_step="Verify Monday label";
				executeStep(isWebElementPresent(Cloudfm.label_Monday, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String label=GetAttribute(Cloudfm.label_Monday, IOSConstants.Common.type_xpath);
				 String Actual= TimesheetDayAspercloudfm(label);
				 Assert.assertTrue(expected.contains(Actual));
				 /*if(expected.contains(Actual)){
					System.out.println(expected+" Current Monday Date and ColudFm Timesheet Monday date matched "+Actual);
					}*/
				logging_step="Verify Monday header";
				executeStep(isWebElementPresent(Cloudfm.label_Mondayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String Mondayheader=GetAttribute(Cloudfm.label_Mondayheader, IOSConstants.Common.type_xpath);
				String Mondaylabel=GetAttribute(Cloudfm.label_Monday, IOSConstants.Common.type_xpath);
				Assert.assertTrue(Mondayheader.contains(Mondaylabel));
				/*if(Mondayheader.contains(Mondaylabel)){
					System.out.println(Mondayheader+" Timesheet Monday header and Timesheet Monday title label matched "+Mondaylabel);
				}*/
				flag=true;
			}
			return flag;
	}
		public boolean VerifyTimesheetTuesdaylabel() throws Exception{
			boolean flag=false;String expected=GetTuesdayOfCurrentWeek();
			swipeHorizontal();
			if(isWebElementPresent(Cloudfm.label_Tuesday, IOSConstants.Common.type_xpath)){
				logging_step="Verify Tuesday label";
				executeStep(isWebElementPresent(Cloudfm.label_Tuesday, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String label=GetAttribute(Cloudfm.label_Tuesday, IOSConstants.Common.type_xpath);
				 String Actual= TimesheetDayAspercloudfm(label);
				 Assert.assertTrue(expected.contains(Actual));
				 /*if(expected.contains(Actual)){
					System.out.println(expected+" Current Tuesday Date and ColudFm Timesheet Tuesday date matched "+Actual);
					}*/
				logging_step="Verify Tuesday header";
				executeStep(isWebElementPresent(Cloudfm.label_Tuesdayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String Tuesdayheader=GetAttribute(Cloudfm.label_Tuesdayheader, IOSConstants.Common.type_xpath);
				String Tuesdaylabel=GetAttribute(Cloudfm.label_Tuesday, IOSConstants.Common.type_xpath);
				 Assert.assertTrue(Tuesdayheader.contains(Tuesdaylabel));
				/*if(Tuesdayheader.contains(Tuesdaylabel)){
					System.out.println(Tuesdayheader+" Timesheet Tuesday header and Timesheet title Tuesday label matched "+Tuesdaylabel);
				}*/
				flag=true;
				}
				return flag;
	}
		public boolean VerifyTimesheetWednesdaylabel() throws Exception{
			boolean flag=false;String expected=GetWednesdayOfCurrentWeek();
			swipeHorizontal();
			if(isWebElementPresent(Cloudfm.label_Wednesday, IOSConstants.Common.type_xpath)){
				logging_step="Verify Wednesday label";
				executeStep(isWebElementPresent(Cloudfm.label_Wednesday, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String label=GetAttribute(Cloudfm.label_Wednesday, IOSConstants.Common.type_xpath);
				 String Actual= TimesheetDayAspercloudfm(label);
				 Assert.assertTrue(expected.contains(Actual));
				 /*if(expected.contains(Actual)){
					System.out.println(expected+" Current Wednesday Date and ColudFm Timesheet Wednesday date matched "+Actual);
					}*/
				logging_step="Verify Wednesday header";
				executeStep(isWebElementPresent(Cloudfm.label_Wednesdayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String Wednesdayheader=GetAttribute(Cloudfm.label_Wednesdayheader, IOSConstants.Common.type_xpath);
				String Wednesdaylabel=GetAttribute(Cloudfm.label_Wednesday, IOSConstants.Common.type_xpath);
				Assert.assertTrue(Wednesdayheader.contains(Wednesdaylabel));
				/*if(Wednesdayheader.contains(Wednesdaylabel)){
					System.out.println(Wednesdayheader+" Timesheet Wednesday header and Timesheet Wednesday title label matched "+Wednesdaylabel);
				}*/
				flag=true;
				}
				return flag;
	}
		public boolean VerifyTimesheetThrusdaylabel() throws Exception{
			boolean flag=false;String expected=GetThursdayOfCurrentWeek();
			swipeHorizontal();
			if(isWebElementPresent(Cloudfm.label_Thursday, IOSConstants.Common.type_xpath)){
				logging_step="Verify Thrusday label";
				executeStep(isWebElementPresent(Cloudfm.label_Thursday, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String label=GetAttribute(Cloudfm.label_Thursday, IOSConstants.Common.type_xpath);
				 String Actual= TimesheetDayAspercloudfm(label);
				 Assert.assertTrue(expected.contains(Actual));
				 /*if(expected.contains(Actual)){
					System.out.println(expected+" Current Thursday Date and ColudFm Timesheet Thursday date matched "+Actual);
					}*/
				logging_step="Verify Thursday header";
				executeStep(isWebElementPresent(Cloudfm.label_Thursdayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String Thursdayheader=GetAttribute(Cloudfm.label_Thursdayheader, IOSConstants.Common.type_xpath);
				String Thursdaylabel=GetAttribute(Cloudfm.label_Thursday, IOSConstants.Common.type_xpath);
				Assert.assertTrue(Thursdayheader.contains(Thursdaylabel));
				/*if(Thursdayheader.contains(Thursdaylabel)){
					System.out.println(Thursdayheader+" Timesheet Thursday header and Timesheet title Thursday label matched "+Thursdaylabel);
				}*/
				flag=true;
				}
				return flag;
	}
		public boolean VerifyTimesheetFridaylabel() throws Exception{
			boolean flag=false;String expected=GetFridayOfCurrentWeek();
			swipeHorizontal();
			if(isWebElementPresent(Cloudfm.label_Friday, IOSConstants.Common.type_xpath)){
				logging_step="Verify Friday label";
				executeStep(isWebElementPresent(Cloudfm.label_Friday, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String label=GetAttribute(Cloudfm.label_Friday, IOSConstants.Common.type_xpath);
				 String Actual= TimesheetDayAspercloudfm(label);
				 Assert.assertTrue(expected.contains(Actual));
				 /*if(expected.contains(Actual)){
					System.out.println(expected+" Current Friday Date and ColudFm Timesheet Friday date matched "+Actual);
					}*/
				logging_step="Verify Friday header";
				executeStep(isWebElementPresent(Cloudfm.label_Fridayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String Fridayheader=GetAttribute(Cloudfm.label_Fridayheader, IOSConstants.Common.type_xpath);
				String Fridaylabel=GetAttribute(Cloudfm.label_Friday, IOSConstants.Common.type_xpath);
				Assert.assertTrue(Fridayheader.contains(Fridaylabel));
				/*if(Fridayheader.contains(Fridaylabel)){
					System.out.println(Fridayheader+" Timesheet Friday header and Timesheet title Friday label matched "+Fridaylabel);
				}*/
				flag=true;
				}
				return flag;
	}
		public boolean VerifyTimesheetSaturdaylabel() throws Exception{
			boolean flag=false;String expected=GetSaturdayOfCurrentWeek();
			swipeHorizontal();
			if(isWebElementPresent(Cloudfm.label_Saturday, IOSConstants.Common.type_xpath)){
				logging_step="Verify Saturday label";
				executeStep(isWebElementPresent(Cloudfm.label_Saturday, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String label=GetAttribute(Cloudfm.label_Saturday, IOSConstants.Common.type_xpath);
				 String Actual= TimesheetDayAspercloudfm(label);
				 Assert.assertTrue(expected.contains(Actual));
				/*if(expected.contains(Actual)){
					System.out.println(expected+" Current Saturday Date and ColudFm Timesheet Saturday date matched "+Actual);
					}*/
				logging_step="Verify Saturday header";
				executeStep(isWebElementPresent(Cloudfm.label_Saturdayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String Saturdayheader=GetAttribute(Cloudfm.label_Saturdayheader, IOSConstants.Common.type_xpath);
				String Saturdaylabel=GetAttribute(Cloudfm.label_Saturday, IOSConstants.Common.type_xpath);
				Assert.assertTrue(Saturdayheader.contains(Saturdaylabel));
				/*if(Saturdayheader.contains(Saturdaylabel)){
					System.out.println(Saturdayheader+" Timesheet Saturday header and Timesheet title Saturday label matched "+Saturdaylabel);
				}*/
				flag=true;
				}
				return flag;
	}
		public boolean VerifyTimesheetSundaylabel() throws Exception{
			boolean flag=false;String expected=GetSundayOfCurrentWeek();
			swipeHorizontal();
			if(isWebElementPresent(Cloudfm.label_Sunday, IOSConstants.Common.type_xpath)){
				logging_step="Verify Tuesday label";
				executeStep(isWebElementPresent(Cloudfm.label_Sunday, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String label=GetAttribute(Cloudfm.label_Sunday, IOSConstants.Common.type_xpath);
				 String Actual= TimesheetDayAspercloudfm(label);
				 Assert.assertTrue(expected.contains(Actual));
				 /*if(expected.contains(Actual)){
					System.out.println(expected+" Current Sunday Date and ColudFm Timesheet Sunday date matched "+Actual);
					}*/
				logging_step="Verify Sunday header";
				executeStep(isWebElementPresent(Cloudfm.label_Sundayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
				String Sundayheader=GetAttribute(Cloudfm.label_Sundayheader, IOSConstants.Common.type_xpath);
				String Sundaylabel=GetAttribute(Cloudfm.label_Sunday, IOSConstants.Common.type_xpath);
				Assert.assertTrue(Sundayheader.contains(Sundaylabel));
				/*if(Sundayheader.contains(Sundaylabel)){
					System.out.println(Sundayheader+" Timesheet Sunday header and Timesheet title Sunday label matched "+Sundaylabel);
				}*/
				flag=true;
				}
				return flag;
	}	
		public boolean VerifyTimesheet_Headers_Labels() throws Exception{
			boolean flag=false;
			if(isWebElementPresent(Cloudfm.label_Mondayheader, IOSConstants.Common.type_xpath)&&isWebElementPresent(Cloudfm.label_Sundayheader, IOSConstants.Common.type_xpath)){
				VerifyTimesheetMondaylabel();
				VerifyTimesheetTuesdaylabel();
				VerifyTimesheetWednesdaylabel();
				VerifyTimesheetThrusdaylabel();
				VerifyTimesheetFridaylabel();
				VerifyTimesheetSaturdaylabel();
				VerifyTimesheetSundaylabel();
				flag=true;
				}
				return flag;
	}
		public boolean VerifyTimesheettableheaders() throws Exception{
			boolean flag=false;
			if(isWebElementPresent(Cloudfm.Table_client, IOSConstants.Common.type_xpath) && isWebElementPresent(Cloudfm.label_BulidingMonDay, IOSConstants.Common.type_xpath)){
				executionDelay(5000);
				logging_step="Verify Buliding day on Timesheet screen";
				executeStep(isWebElementPresent(Cloudfm.label_BulidingMonDay, IOSConstants.Common.type_xpath), getClass(), logging_step);
				logging_step="Verify client header on Timesheet screen";
				executeStep(isWebElementPresent(Cloudfm.Table_client, IOSConstants.Common.type_xpath), getClass(), logging_step);
				logging_step="Verify Task Number header on Timesheet screen";
				executeStep(isWebElementVisible(Cloudfm.Table_TaskNum, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Discipline header on Timesheet screen";
				executeStep(isWebElementVisible(Cloudfm.Table_Discipline, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Task Type header on Timesheet screen";
				executeStep(isWebElementVisible(Cloudfm.Table_TaskType, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Arrival header on Timesheet screen";
				executeStep(isWebElementVisible(Cloudfm.Table_Arrival, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Departure header on Timesheet screen";
				executeStep(isWebElementVisible(Cloudfm.Table_Departure, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Travel header on Timesheet screen";
				executeStep(isWebElementVisible(Cloudfm.Table_Travel, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Mileage header on Timesheet screen";
				executeStep(isWebElementVisible(Cloudfm.Table_Mileage, IOSConstants.Common.type_name), getClass(), logging_step);
				logging_step="Verify Time on Task header on Timesheet screen";
				executeStep(isWebElementVisible(Cloudfm.Table_TimeonTask, IOSConstants.Common.type_name), getClass(), logging_step);
				flag=true;
			}
			else{
				System.out.println("No Timesheet table found on Timesheet Screen");
				flag=true;
			}
				return flag;
	}
		public boolean VerifyNextbutton() throws Exception{
			boolean flag= false;
				executionDelay(2000);
				if(isWebElementPresent(Cloudfm.btn_Next, IOSConstants.Common.type_xpath)){
					logging_step="Verify next button and click on next button";
					executeStep(click(Cloudfm.btn_Next, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(2000);
					flag= true;
					}
				return flag;
				}
		public boolean VerifyPreviousbutton() throws Exception{
			boolean flag= false;
				executionDelay(2000);
				if(isWebElementPresent(Cloudfm.btn_Previous, IOSConstants.Common.type_xpath)){
					logging_step="Verify Previous button and click on Previous button";
					executeStep(click(Cloudfm.btn_Previous, IOSConstants.Common.type_xpath), getClass(), logging_step);
					executionDelay(2000);
					flag= true;
					}
				return flag;
				}
		public boolean VerifyExitbutton() throws Exception{
			boolean flag= false;
				executionDelay(2000);
				if(isWebElementVisible(Cloudfm.btn_Exit, IOSConstants.Common.type_name)){
					logging_step="Verify Exit button and click on Exit button";
					executeStep(click(Cloudfm.btn_Exit, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(2000);
					flag= true;
					}
				return flag;
				}
		public boolean VerifyMyAgendaScreen() throws Exception{
			boolean flag= false;
				executionDelay(2000);
				if(isWebElementVisible(Cloudfm.label_MyAgenda, IOSConstants.Common.type_name)){
					logging_step="Verify My Agenda header";
					executeStep(isWebElementVisible(Cloudfm.label_MyAgenda, IOSConstants.Common.type_name), getClass(), logging_step);
					logging_step="Verify My Agenda page number 2/3";
					executeStep(isWebElementVisible(Cloudfm.label_pagenumber, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(2000);
					flag= true;
					}
				return flag;
				}
		public boolean VerifyMyAgendaFields() throws Exception{
			boolean flag= false;
				executionDelay(2000);
				if(isWebElementVisible(Cloudfm.label_MyAgenda, IOSConstants.Common.type_name)){
					VerifyMyAgendaScreen();
					logging_step="Verify Sync button";
					executeStep(isWebElementVisible(Cloudfm.btn_Sync, IOSConstants.Common.type_name), getClass(), logging_step);
					logging_step="Verify Past label";
					executeStep(isWebElementVisible(Cloudfm.label_Past, IOSConstants.Common.type_name), getClass(), logging_step);
					logging_step="Verify Today label";
					executeStep(isWebElementVisible(Cloudfm.label_Today, IOSConstants.Common.type_name), getClass(), logging_step);
					logging_step="Verify Tomorrow label";
					executeStep(isWebElementVisible(Cloudfm.label_Tomorrow, IOSConstants.Common.type_name), getClass(), logging_step);
					logging_step="Verify Future label";
					executeStep(isWebElementVisible(Cloudfm.label_Future, IOSConstants.Common.type_name), getClass(), logging_step);
					logging_step="Verify Next button";
					executeStep(isWebElementPresent(Cloudfm.btn_Next, IOSConstants.Common.type_xpath), getClass(), logging_step);
					logging_step="Verify Previous button and click on it";
					executeStep(isWebElementPresent(Cloudfm.btn_Previous, IOSConstants.Common.type_xpath), getClass(), logging_step);
					logging_step="Verify Exit button";
					executeStep(isWebElementVisible(Cloudfm.btn_Exit, IOSConstants.Common.type_name), getClass(), logging_step);
					/*String label=GetAttribute(Cloudfm.btn_Previous, IOSConstants.Common.type_xpath);
					executeStep(click(Cloudfm.btn_Previous, IOSConstants.Common.type_xpath), getClass(), logging_step);
					System.out.println("Previous button name of the attribute: "+label);*/
					executionDelay(2000);
					flag= true;
					}
				return flag;
				}
		public boolean VerifySyncButton() throws Exception{
			boolean flag= false;
				executionDelay(2000);
				if(isWebElementVisible(Cloudfm.btn_Sync, IOSConstants.Common.type_name)){
					logging_step="Verify Sync button and click on Sync button";
					executeStep(click(Cloudfm.btn_Sync, IOSConstants.Common.type_name), getClass(), logging_step);
					executionDelay(10000);
					flag= true;
					}
				return flag;
				}
		public boolean VerifyTaskNumbers() throws Exception{
			boolean flag= false;
				executionDelay(2000);
				if(isWebElementVisible(Cloudfm.btn_Sync, IOSConstants.Common.type_name)){
					//Get Past Task Number and verify the Element found or not
					String PastTask=GetAttribute(Cloudfm.label_Past_Task, IOSConstants.Common.type_xpath);
					logging_step="Verify Past Task Number, Device displayed Past Task is:"+PastTask;
					executeStep(isWebElementPresent(Cloudfm.label_Past_Task, IOSConstants.Common.type_xpath), getClass(), logging_step);
					//Get Today Task Number and verify the Element found or not
					String TodayTask=GetAttribute(Cloudfm.label_Today_Task, IOSConstants.Common.type_xpath);
					logging_step="Verify Today Task Number, Device displayed Present Today Task is: "+TodayTask;
					executeStep(isWebElementPresent(Cloudfm.label_Today_Task, IOSConstants.Common.type_xpath), getClass(), logging_step);
					//Get Tomorrow Task Number and verify the Element found or not
					String TomorrowTask=GetAttribute(Cloudfm.label_Tomorrow_Task, IOSConstants.Common.type_xpath);
					logging_step="Verify Tomorrow Task Number, Device displayed Tomorrow Task is: "+TomorrowTask;
					executeStep(isWebElementPresent(Cloudfm.label_Tomorrow_Task, IOSConstants.Common.type_xpath), getClass(), logging_step);
					//Get Future Task Number and verify the Element found or not
					String FutureTask=GetAttribute(Cloudfm.label_Future_Task, IOSConstants.Common.type_xpath);
					logging_step="Verify Future Task Number, Device displayed Future Task is: "+FutureTask;
					executeStep(isWebElementPresent(Cloudfm.label_Future_Task, IOSConstants.Common.type_xpath), getClass(), logging_step);
					//System.out.println(driver.getPageSource());
					executionDelay(10000);
					flag= true;
					}
				return flag;
				}
}
//*************************************************************************************************************************************************************************
/*		public boolean VerifyVehicleOdometerStart(String StartDayValue) throws Exception{
boolean flag=false;
if(isWebElementPresent(Cloudfm.txtfield_VehicleOdometer, IOSConstants.Common.type_xpath)){
	logging_step="Verify Vehicle Odometer input text field";
	executeStep(writeInInput(Cloudfm.txtfield_VehicleOdometer, IOSConstants.Common.type_xpath,StartDayValue), getClass(), logging_step);
	executionDelay(2000);

		flag=true;
		}
	return flag;
}*/
/*		public boolean VerifyVehicleOdometerEnd(String EndDayValue) throws Exception{
boolean flag=false;
if(isWebElementPresent(Cloudfm.txtfield_VehicleOdometer, IOSConstants.Common.type_xpath)){
	logging_step="Verify Vehicle Odometer input text field";
	executeStep(writeInInput(Cloudfm.txtfield_VehicleOdometer, IOSConstants.Common.type_xpath,EndDayValue), getClass(), logging_step);
	executionDelay(2000);
		flag=true;
		}
	return flag;
}*/
/*public boolean VerifyTimesheetMondaylabel() throws Exception{
	boolean flag=false;String expected=GetMondayOfCurrentWeek();
	if(isWebElementPresent(Cloudfm.label_Monday, IOSConstants.Common.type_xpath)){
		logging_step="Verify Monday label";
		executeStep(isWebElementPresent(Cloudfm.label_Monday, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String label=GetAttribute(Cloudfm.label_Monday, IOSConstants.Common.type_xpath);
		 //System.out.println(x);
		 String Actual= DateModifiaction(label,GetMondayOfCurrentWeek());
		 if(expected.contains(Actual)){
			System.out.println(expected+" Current Monday Date and ColudFm Timesheet Monday date matched "+Actual);
			}
		logging_step="Verify Monday header";
		executeStep(isWebElementPresent(Cloudfm.label_Mondayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String Mondayheader=GetAttribute(Cloudfm.label_Mondayheader, IOSConstants.Common.type_xpath);
		String Mondaylabel=GetAttribute(Cloudfm.label_Monday, IOSConstants.Common.type_xpath);
		if(Mondayheader.contains(Mondaylabel)){
			System.out.println(Mondayheader+" Timesheet Monday header and Timesheet Monday title label matched "+Mondaylabel);
		}
		flag=true;
	}
	return flag;
}
public boolean VerifyTimesheetheaders() throws Exception{
	boolean flag=false;
	if(isWebElementVisible(Cloudfm.label_Timesheet, IOSConstants.Common.type_name)){				
		logging_step="Verify Monday label in header";
		executeStep(isWebElementPresent(Cloudfm.label_Mondayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String Mondayheader=GetAttribute(Cloudfm.label_Mondayheader, IOSConstants.Common.type_xpath);
		String Mondaylabel=GetAttribute(Cloudfm.label_Monday, IOSConstants.Common.type_xpath);
		if(Mondayheader.contains(Mondaylabel)){
			System.out.println(Mondayheader+" Timesheet Monday header and Timesheet Monday title label matched "+Mondaylabel);
		}
		logging_step="Verify Tuesday label in header";
		executeStep(isWebElementPresent(Cloudfm.label_Tuesdayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String Tuesdayheader=GetAttribute(Cloudfm.label_Tuesdayheader, IOSConstants.Common.type_xpath);
		String Tuesdaylabel=GetAttribute(Cloudfm.label_Tuesday, IOSConstants.Common.type_xpath);
		if(Tuesdayheader.contains(Tuesdaylabel)){
			System.out.println(Tuesdayheader+" Timesheet Tuesday header and Timesheet title Tuesday label matched "+Tuesdaylabel);
		}
		logging_step="Verify Wednesday label in header";
		executeStep(isWebElementPresent(Cloudfm.label_Wednesdayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String Wednesdayheader=GetAttribute(Cloudfm.label_Wednesdayheader, IOSConstants.Common.type_xpath);
		String Wednesdaylabel=GetAttribute(Cloudfm.label_Wednesday, IOSConstants.Common.type_xpath);
		if(Wednesdayheader.contains(Wednesdaylabel)){
			System.out.println(Wednesdayheader+" Timesheet Wednesday header and Timesheet Wednesday title label matched "+Wednesdaylabel);
		}
		logging_step="Verify Thursday label in header";
		executeStep(isWebElementPresent(Cloudfm.label_Thursdayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String Thursdayheader=GetAttribute(Cloudfm.label_Thursdayheader, IOSConstants.Common.type_xpath);
		String Thursdaylabel=GetAttribute(Cloudfm.label_Thursday, IOSConstants.Common.type_xpath);
		if(Thursdayheader.contains(Thursdaylabel)){
			System.out.println(Thursdayheader+" Timesheet Thursday header and Timesheet title Thursday label matched "+Thursdaylabel);
		}
		logging_step="Verify Friday label in header";
		executeStep(isWebElementPresent(Cloudfm.label_Fridayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String Fridayheader=GetAttribute(Cloudfm.label_Fridayheader, IOSConstants.Common.type_xpath);
		String Fridaylabel=GetAttribute(Cloudfm.label_Friday, IOSConstants.Common.type_xpath);
		if(Fridayheader.contains(Fridaylabel)){
			System.out.println(Fridayheader+" Timesheet Friday header and Timesheet title Friday label matched "+Fridaylabel);
		}
		logging_step="Verify Saturday label in header";
		executeStep(isWebElementPresent(Cloudfm.label_Saturdayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String Saturdayheader=GetAttribute(Cloudfm.label_Saturdayheader, IOSConstants.Common.type_xpath);
		String Saturdaylabel=GetAttribute(Cloudfm.label_Saturday, IOSConstants.Common.type_xpath);
		if(Saturdayheader.contains(Saturdaylabel)){
			System.out.println(Saturdayheader+" Timesheet Saturday header and Timesheet title Saturday label matched "+Saturdaylabel);
		}
		logging_step="Verify Sunday label in header";
		executeStep(isWebElementPresent(Cloudfm.label_Sundayheader, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String Sundayheader=GetAttribute(Cloudfm.label_Sundayheader, IOSConstants.Common.type_xpath);
		String Sundaylabel=GetAttribute(Cloudfm.label_Sunday, IOSConstants.Common.type_xpath);
		if(Sundayheader.contains(Sundaylabel)){
			System.out.println(Sundayheader+" Timesheet Sunday header and Timesheet title Sunday label matched "+Sundaylabel);
		}
		flag=true;
	}
return flag;
}

	public boolean VerifyTimesheetTitle() throws Exception{
	boolean flag=false;
	if(isWebElementVisible(Cloudfm.label_Timesheet, IOSConstants.Common.type_name)){
		Thread.sleep(5000);	
		logging_step="Verify Monday label in title";
		executeStep(isWebElementPresent(Cloudfm.label_Monday, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String text=GetAttribute(Cloudfm.label_Monday, IOSConstants.Common.type_xpath);
		System.out.println(text);
		logging_step="Verify Tuesday label in title";
		executeStep(isWebElementPresent(Cloudfm.label_Tuesday, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String text1=GetAttribute(Cloudfm.label_Tuesday, IOSConstants.Common.type_xpath);
		System.out.println(text1);
		logging_step="Verify Wednesday label in title";
		executeStep(isWebElementPresent(Cloudfm.label_Wednesday, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String text2=GetAttribute(Cloudfm.label_Wednesday, IOSConstants.Common.type_xpath);
		System.out.println(text2);
		logging_step="Verify Thrusday label in title";
		executeStep(isWebElementPresent(Cloudfm.label_Thursday, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String text3=GetAttribute(Cloudfm.label_Thursday, IOSConstants.Common.type_xpath);
		System.out.println(text3);
		logging_step="Verify Friday label in title";
		executeStep(isWebElementPresent(Cloudfm.label_Friday, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String text4=GetAttribute(Cloudfm.label_Friday, IOSConstants.Common.type_xpath);
		System.out.println(text4);
		logging_step="Verify Saturday label in title";
		executeStep(isWebElementPresent(Cloudfm.label_Saturday, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String text5=GetAttribute(Cloudfm.label_Saturday, IOSConstants.Common.type_xpath);
		System.out.println(text5);
		logging_step="Verify Sunday label in title";
		executeStep(isWebElementPresent(Cloudfm.label_Sunday, IOSConstants.Common.type_xpath), getClass(), logging_step);
		String text6=GetAttribute(Cloudfm.label_Sunday, IOSConstants.Common.type_xpath);
		System.out.println(text6);
		flag=true;
	}
		return flag;
}*/
//Calendar c=GregorianCalendar.getInstance();
/*String x=driver.getPageSource();
String TestFile = "/Users/lavanya/Desktop/temp.txt";
  File FC = new File(TestFile);//Created object of java File class.
  FC.createNewFile();//Create file.
  
  //Writing In to file.
  //Create Object of java FileWriter and BufferedWriter class.
  FileWriter FW = new FileWriter(TestFile);
  BufferedWriter BW = new BufferedWriter(FW);
  BW.write(x); //Writing In To File.
  BW.close();*/

/*public void CheckMsgPopup() throws Exception{	
try{
	boolean userDeact=driver.findElement(By.name("User Deactivated")).isDisplayed();
		if(userDeact){
			logging_step="Verify the Deactivate message on forgot password screen";
			executeStep(click(Cloudfm.msg_Userdeactivated, IOSConstants.Common.type_name), getClass(), logging_step);	
			Thread.sleep(2000);
		}
		}
		catch(Exception e){
			boolean NotRecg= driver.findElement(By.name("Your Mobile number Is Not Recognised")).isDisplayed();
			 if(NotRecg){
					logging_step="Verify the NotRecognised message on forgot password screen";
					executeStep(click(Cloudfm.msg_NotRecognised, IOSConstants.Common.type_name), getClass(), logging_step);
					Thread.sleep(2000);
					}
			driver.closeApp();
		}
}*/
	/*public void UserDeactivated() throws Exception{	
		try{		
			WebElement FgtPwd = driver.findElement(By.name("Forgot Password?"));
				if(FgtPwd.isDisplayed()){
					logging_step="Click on Forgot Password button";
					executeStep(click(Cloudfm.btn_ForgotPassword, IOSConstants.Common.type_name), getClass(), logging_step);
					driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			WebElement FgtMble = driver.findElement(By.name("mobile number"));
				if(FgtMble.isDisplayed()){
					logging_step="Write Mobile Number of the User";
					executeStep(writeInInput(Cloudfm.input_FgtPwd_mobileNo, IOSConstants.Common.type_name, Utility.GetValue("unauthorised")),getClass(),logging_step);
					logging_step="Click on Resend Password button";
					WebElement ResendPwd = driver.findElement(By.name("Resend Password"));
						if(ResendPwd.isDisplayed()){
						executeStep(click(Cloudfm.btn_ResendPwd, IOSConstants.Common.type_name), getClass(), logging_step);
						driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			WebElement Msg_Userdeactivate = driver.findElement(By.name("User Deactivated"));
				if(Msg_Userdeactivate.isDisplayed()){
					logging_step="Verify the Deactivate message on forgot password screen";
					executeStep(click(Cloudfm.msg_Userdeactivated, IOSConstants.Common.type_name), getClass(), logging_step);	
					//System.out.println(driver.getPageSource());
					Thread.sleep(2000);
					driver.closeApp();
				}
					}
				}
			}
		}
				catch(Exception e){
					e.printStackTrace();
					logging_step="locator not displayed";	
					
				}
	}
	public void NotRecognisedMessage() throws Exception{	
		try{		
			WebElement FgtPwd = driver.findElement(By.name("Forgot Password?"));
				if(FgtPwd.isDisplayed()){
					logging_step="Click on Forgot Password button";
					executeStep(click(Cloudfm.btn_ForgotPassword, IOSConstants.Common.type_name), getClass(), logging_step);
					Thread.sleep(2000);
			WebElement FgtMble = driver.findElement(By.name("mobile number"));
				if(FgtMble.isDisplayed()){
					logging_step="Write Mobile Number of the User";
					executeStep(writeInInput(Cloudfm.input_FgtPwd_mobileNo, IOSConstants.Common.type_name, Utility.GetValue("NotRecognised")),getClass(),logging_step);
					logging_step="Click on Resend Password button";
			WebElement ResendPwd = driver.findElement(By.name("Resend Password"));
				if(ResendPwd.isDisplayed()){
					executeStep(click(Cloudfm.btn_ResendPwd, IOSConstants.Common.type_name), getClass(), logging_step);
					Thread.sleep(2000);
					WebElement Msg_NotRecognise = driver.findElement(By.name("Your Mobile number Is Not Recognised"));
					if(Msg_NotRecognise.isDisplayed()){
						logging_step="Verify the NotRecognised message on forgot password screen";
						executeStep(click(Cloudfm.msg_NotRecognised, IOSConstants.Common.type_name), getClass(), logging_step);
					Thread.sleep(5000);
					}
					}
				}
			}
		}
				catch(Exception e){
					e.printStackTrace();
					logging_step="locator not displayed";	
					
				}
	}*/
/*public void Homescreen_navigation() throws Exception{
try{
	Thread.sleep(2000);
if(isWebElementPresent(Cloudfm.btn_Clients, IOSConstants.Common.type_xpath)){
		logging_step="Verify Clients button and click on Clients button";
		executeStep(click(Cloudfm.btn_Clients, IOSConstants.Common.type_xpath), getClass(), logging_step);
		Thread.sleep(2000);
		Validatelogoicon();
if(isWebElementVisible(Cloudfm.btn_version, IOSConstants.Common.type_name)){
		logging_step="Verify Version button and click on version button";
		executeStep(click(Cloudfm.btn_version, IOSConstants.Common.type_name), getClass(), logging_step);
		Thread.sleep(2000);
		Validatelogoicon();
if(isWebElementVisible(Cloudfm.btn_Agenda, IOSConstants.Common.type_name)){
		logging_step="Verify Agenda button and click on Agenda button";
		executeStep(click(Cloudfm.btn_Agenda, IOSConstants.Common.type_name), getClass(), logging_step);
		Thread.sleep(2000);
		Validatelogoicon();
if(isWebElementVisible(Cloudfm.btn_options, IOSConstants.Common.type_name)){
		logging_step="Verify Options button and click on Options button";
		executeStep(click(Cloudfm.btn_options, IOSConstants.Common.type_name), getClass(), logging_step);
		Thread.sleep(2000);
		Validatelogoicon();
		}
		}
}
	}
	}
	catch(Exception e){
		e.printStackTrace();
		logging_step="locator not displayed";	
		}
	}*/

	//*****************************************
	/*public boolean Checkforgotpassword() throws InterruptedException
	{
		boolean flag =false;
		Checkpopup();
		Thread.sleep(1500);
		logging_step = "click on Forgotpassword";
		executeStep(click(Cloudfm.btn_ForgotPassword,IOSConstants.Common.type_name), getClass(), logging_step);
		logging_step = "check resend password and mobile number visible";
		System.out.println(logging_step);
		if(isWebElementPresent(Cloudfm.btn_ResendPwd, IOSConstants.Common.type_name) && (isWebElementPresent(Cloudfm.input_FgtPwd_mobileNo, IOSConstants.Common.type_name)))
		flag = true;
	    	
	    return flag;
		}
		 
	
	
	public void Checkpopup() throws InterruptedException
	{
		
		if (isWebElementPresent(Cloudfm.msg_Userdeactivated, IOSConstants.Common.type_xpath)==true)
		{
			executeStep(click(Cloudfm.msg_Userdeactivated, IOSConstants.Common.type_xpath), getClass(), logging_step);
		}
		}*/


