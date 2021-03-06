package Utilities;

import static org.testng.Assert.assertTrue;

import java.io.IOException;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.testng.Assert;

//import Flow.Objects.AndroidCon
//import Flow.Objects.AndroidConstants.Flow;
import ch.qos.logback.core.Context;
import ch.qos.logback.core.joran.action.Action;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import io.appium.java_client.SwipeElementDirection;
import io.appium.java_client.TouchAction;
import net.sourceforge.htmlunit.corejs.javascript.regexp.SubString;

public class AndroidApplicationFunctions extends KeywordUtil {
	public int pasttasknum;
	public static String logging_step;
	public static Dimension size;
	
	public void NavigateToLoginPage() throws InterruptedException
	{
		if(isWebElementPresent(AndroidConstants.Flow.btn_image, AndroidConstants.Common.type_xpath))
		{
			LogoutOfapplication();
		}
		
		logging_step = "click on login with email to navigate to login page";
		executeStep(click(AndroidConstants.Flow.btn_lgn_with_email, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	
	}
	public void allowPopup() throws InterruptedException
	{
		if(isWebElementPresent(AndroidConstants.Flow.btn_allow, AndroidConstants.Common.type_xpath))
		{
		logging_step = "allow pop up if visible";
		executeStep(click(AndroidConstants.Flow.btn_allow, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		
		}
	}
	
	public void LogintoTheApplication(String uname, String Pwd)throws InterruptedException
	{
		
		if(isWebElementPresent(AndroidConstants.Flow.txt_username, AndroidConstants.Common.type_xpath))
		{
			logging_step = "write the username in email field";
			executeStep(writeInInput(AndroidConstants.Flow.txt_username, AndroidConstants.Common.type_xpath,uname), getClass(), logging_step);
			
			logging_step = "write the password in password field";
			executeStep(writeInInput(AndroidConstants.Flow.txt_password, AndroidConstants.Common.type_xpath,Pwd), getClass(), logging_step);
			
			logging_step = "click on signin";
			executeStep(click(AndroidConstants.Flow.btn_signin, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		   Thread.sleep(10000);
			
		
		}
	}
	public void GoToAccountDetails() throws InterruptedException
	{
		if(isWebElementPresent(AndroidConstants.Flow.btn_image, AndroidConstants.Common.type_xpath))
		{
			Thread.sleep(6000);
			logging_step = "click on the image";
			executeStep(click(AndroidConstants.Flow.btn_image, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		}
	}
	
	public void switchEnvironment() throws InterruptedException
	{
		GoToAccountDetails();
        if(isWebElementPresent(AndroidConstants.Flow.btn2_img, AndroidConstants.Common.type_xpath))
	    {
        	logging_step = "click on image2 to change the environment ";
			executeStep(click(AndroidConstants.Flow.btn2_img, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		}
        
        
        if(isWebElementPresent(AndroidConstants.Flow.workspace, AndroidConstants.Common.type_xpath))
        		{
        	logging_step = "click on workspace to change it to QA environment ";
			executeStep(click(AndroidConstants.Flow.workspace, AndroidConstants.Common.type_xpath), getClass(), logging_step);
        		}
        
		
	}
	public void LogoutOfapplication() throws InterruptedException
	{
		GoToAccountDetails();
		if(isWebElementPresent(AndroidConstants.Flow.User_name, AndroidConstants.Common.type_xpath))
		{
			logging_step = "click on user to navigate to his accout details page ";
			executeStep(click(AndroidConstants.Flow.User_name, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		
		}
		if(isWebElementPresent(AndroidConstants.Flow.img_profile, AndroidConstants.Common.type_xpath))
		{
			logging_step = "click more options to see logout ";
			executeStep(click(AndroidConstants.Flow.img_profile, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		   
			logging_step ="click on logout";
			executeStep(click(AndroidConstants.Flow.Logout, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		}
		
	}
	public void ClickCreateNewProject() throws InterruptedException
	{
		if(isWebElementPresent(AndroidConstants.Flow.Project, AndroidConstants.Common.type_xpath))
		{
			logging_step = "click on project to create a new one ";
			executeStep(click(AndroidConstants.Flow.Project, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		}
	}
	public void CreateAproject(String projName, String projVisibility) throws InterruptedException
	{
		if(isWebElementPresent(AndroidConstants.Flow.txt_projectname, AndroidConstants.Common.type_xpath))
		{
			logging_step = "write project name ";
			executeStep(writeInInput(AndroidConstants.Flow.txt_projectname, AndroidConstants.Common.type_xpath,projName), getClass(), logging_step);
		
			KeywordUtil.HideKeyboard();
			KeywordUtil.swipevertical();
			
			logging_step="assign project to" + projVisibility;
			if(projVisibility=="specificPeople")
			executeStep(click(AndroidConstants.Flow.Pjt_visibility_specificpeople, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		    
			else if(projVisibility=="onlyme")
				executeStep(click(AndroidConstants.Flow.Pjt_visibility_onlyme, AndroidConstants.Common.type_xpath), getClass(), logging_step);
			else
				executeStep(click(AndroidConstants.Flow.Pjt_visibility_everyone, AndroidConstants.Common.type_xpath), getClass(), logging_step);
			}
		
		logging_step="click on create";
		executeStep(click(AndroidConstants.Flow.btn_create, AndroidConstants.Common.type_xpath), getClass(), logging_step);	
		}
	public void taskCreation(String taskname,String projectname) throws InterruptedException
	{   // Thread.sleep(10000);
	     //executeStep(AndroidUtil.swipeHorizontal(), getClass(), "swipe horizontal");
	     //ClickonHowitworks();
	 if(isWebElementPresent(AndroidConstants.Flow.privateTask, AndroidConstants.Common.type_xpath))
		 logging_step="click on private task";
		executeStep(click(AndroidConstants.Flow.privateTask, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	     
	     if(isWebElementPresent(AndroidConstants.Flow.task_creator, AndroidConstants.Common.type_xpath)){
		logging_step="click ontask creator";
		executeStep(click(AndroidConstants.Flow.task_creator, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		logging_step="write the task name";
		executeStep(writeInInput(AndroidConstants.Flow.new_task, AndroidConstants.Common.type_xpath,taskname), getClass(), logging_step);
		driver.hideKeyboard();
		//System.out.println(driver.getPageSource());
		 logging_step="click on to give project name";
			executeStep(click(AndroidConstants.Flow.projct_task, AndroidConstants.Common.type_xpath), getClass(), logging_step);
			logging_step="write the project name in which you wanted to create task";
			executeStep(writeInInput(AndroidConstants.Flow.ProjectNmne, AndroidConstants.Common.type_xpath,projectname), getClass(), logging_step);
			logging_step="click on project to be selcted";
			executeStep(click(AndroidConstants.Flow.proj_selct, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	     driver.hideKeyboard(); 
	     }	
	}
	
	public void assigneeSelection() throws InterruptedException
	{
		logging_step="click to assignee";
		executeStep(click(AndroidConstants.Flow.assignee_name, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		logging_step=" assignee to the task selected";
		executeStep(click(AndroidConstants.Flow.Assignee_vijay, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	}
	
	public void subscriber(String subscribername) throws InterruptedException
	{
		KeywordUtil.swipevertical();
		logging_step="click to subscriber";
	executeStep(click(AndroidConstants.Flow.subscriber_btn, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	logging_step="input subscriber name";
	executeStep(writeInInput(AndroidConstants.Flow.input_subscriber, AndroidConstants.Common.type_xpath,subscribername), getClass(), logging_step);
	logging_step="click to subscriber selected";
	executeStep(click(AndroidConstants.Flow.subscriber_name, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	driver.hideKeyboard();
	logging_step="clickok";
	executeStep(click(AndroidConstants.Flow.clickOk, AndroidConstants.Common.type_xpath), getClass(), logging_step);
}
	public void clikToCreate() throws InterruptedException
	{
		logging_step="click to subscriber";
		executeStep(click(AndroidConstants.Flow.clicktoCreate, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		if(isWebElementPresent(AndroidConstants.Flow.btn_back, AndroidConstants.Common.type_xpath)){
			logging_step="click on back";
			executeStep(click(AndroidConstants.Flow.btn_back, AndroidConstants.Common.type_xpath), getClass(), logging_step);
			
		}
	}
	public boolean ClickonHowitworksAssignee(String taskname) throws InterruptedException
	{
		Boolean flag = false;
		executeStep(AndroidUtil.swipeHorizontal(), getClass(), "swipe horizontal");
		logging_step="click on skip";
		executeStep(click(AndroidConstants.Flow.skip, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	
		/*logging_step="click to howit works";
	executeStep(click(Flow.How_it_works, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	executeStep(AndroidUtil.swipeHorizontalleft(), getClass(), "swipe horizontal");
	logging_step="click on review";
	executeStep(click(Flow.review, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	executeStep(AndroidUtil.swipeHorizontal(), getClass(), "swipe horizontal");
	logging_step="click on catchup";
	executeStep(click(Flow.Click_Catchup, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	logging_step="check whther we could find today catchup's";*/
    if(isWebElementPresent(AndroidConstants.Flow.today, AndroidConstants.Common.type_xpath))
    	{
    	logging_step="Notification for assignee recived for Task name:" +taskname;
		executeStep(isWebElementPresent(AndroidConstants.Flow.today, AndroidConstants.Common.type_xpath), getClass(), logging_step);
    	flag=true;
    	}
    else{
    	logging_step="Notification for assignee recived for Task name:" +taskname;
    	executeStep(isWebElementPresent(AndroidConstants.Flow.today, AndroidConstants.Common.type_xpath), getClass(), logging_step);
    	    }
    	 return flag;
	}
	public boolean ClickToGotoCtchup() throws InterruptedException
	{Boolean flag = false;
	if(isWebElementPresent(AndroidConstants.Flow.btn_image, AndroidConstants.Common.type_xpath))
	{
		Thread.sleep(6000);
		logging_step = "click on the image";
		executeStep(click(AndroidConstants.Flow.btn_image, AndroidConstants.Common.type_xpath), getClass(), logging_step);
		logging_step = "click on thecatchup";
		executeStep(click(AndroidConstants.Flow.btn_catchup, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	}
	
	 return flag;
	}
	public boolean ClickonHowitworksSubscriber(String taskname) throws InterruptedException
	{
		Boolean flag = false;
		executeStep(AndroidUtil.swipeHorizontal(), getClass(), "swipe horizontal");
		logging_step="click on skip";
		executeStep(click(AndroidConstants.Flow.skip, AndroidConstants.Common.type_xpath), getClass(), logging_step);
	
    if(isWebElementPresent(AndroidConstants.Flow.today, AndroidConstants.Common.type_xpath))
    	{
    	logging_step="Notification for subscriber recived for Task name:" +taskname;
		executeStep(isWebElementPresent(AndroidConstants.Flow.today, AndroidConstants.Common.type_xpath), getClass(), logging_step);
    	flag=true;
    	}
    else 
    {
    	logging_step="Notification for subscriber recived for Task name:" +taskname;
    	executeStep(isWebElementPresent(AndroidConstants.Flow.today, AndroidConstants.Common.type_xpath), getClass(), logging_step);
    }
    	
    return flag;
	}
	
	public void CreateNewTask(String projectname,String taskname) throws InterruptedException
	{
		if(isWebElementPresent(AndroidConstants.Flow.btn_image, AndroidConstants.Common.type_xpath))
		{
			logging_step="click on image to go the profile page";
			executeStep(isWebElementPresent(AndroidConstants.Flow.btn_image, AndroidConstants.Common.type_xpath), getClass(), logging_step);
			taskCreation(taskname,projectname);
			assigneeSelection();
			clikToCreate();
		}
	}
	
	
}
	
