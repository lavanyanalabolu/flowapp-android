package Utilities;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Wait;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.remote.AutomationName;
import io.appium.java_client.remote.MobileCapabilityType;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import io.appium.java_client.service.local.flags.GeneralServerFlag;

public class DriverUtil extends Utility{
	
	public static AppiumDriverLocalService service = null;
	public static boolean adbFlag;
	@SuppressWarnings("rawtypes")
	public static Wait wait;
	public static String deviceVersion;
	public static String browserVersion;
	public static String webBrowserName;
	public static String bootanim;
	public static String genymotionStatus="stopped";
	public static String appium_ip_address=Utility.GetValue("appium_ip_address");
	public static String appium_port=Utility.GetValue("appium_port");  
	public static DesiredCapabilities capabilities = new DesiredCapabilities();
	    
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static void getAndroidDriver(String browserName) {
		 
//				    	try {
//							Runtime.getRuntime().exec("taskkill /f /im node.exe");
//						   } 
//				    	    catch (IOException e) {
//							e.printStackTrace();
//						 }
				       

			//		   startAppium(Utility.GetValue("node_path"),Utility.GetValue("appium_path"));
					   

					 
					if(browserName.equals("N.A."))
					{
					     androidCapabilities("");
					}
					
					else if(browserName.equalsIgnoreCase("Chrome")){
						androidCapabilities("Chrome");
					}
					
					else if(browserName.equalsIgnoreCase("Browser")){
						androidCapabilities("Browser");
					}
					
					else
					{
						   LogUtil.infoLog(Utility.class,"Make sure Browser value is set to either Chrome or Browser.If automating app then it must be set to N.A.");
						
						   try {
							throw new Exception();
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					
					
					try {
						driver = new AndroidDriver(new URL("http://"+appium_ip_address+":"+appium_port+"/wd/hub"), capabilities);
						
				    	} catch (MalformedURLException e) {
						e.printStackTrace();
					}
					driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS); 
					wait = new FluentWait(driver)
						    .withTimeout(Utility.GetIntValue("explicit_timeout"), TimeUnit.SECONDS)
						    .pollingEvery(Utility.GetIntValue("polling_time"), TimeUnit.SECONDS)
						    .ignoring(NoSuchElementException.class);
						
					}

	
		
	public static void getIOSDriver(String browserName) {
		

		try
		{
			//Runtime.getRuntime().exec("killall -9 node");
			//Runtime.getRuntime().exec("killall -9 Appium");

			//startAppium(Utility.GetValue("ios_node_path"),Utility.GetValue("ios_appium_path"));

			if(browserName.equals("N.A."))
			{
				IOSCapabilities("");
			}


			else if(browserName.equals("Safari"))
			{
				IOSCapabilities("Safari");
			}
			driver = new IOSDriver<>(new URL("http://"+appium_ip_address+":"+appium_port+"/wd/hub"), capabilities);

		}catch(Exception e)
		{
			e.printStackTrace();
		}

	}
	

	public static void getBrowserNameAndVersion() {
		org.openqa.selenium.Capabilities caps = ((RemoteWebDriver) driver).getCapabilities();
		webBrowserName = caps.getBrowserName();
		browserVersion = caps.getVersion();
		System.out.println(webBrowserName);
		System.out.println(browserVersion);
	}
	

	
	public static void startAppium(String nodePath,String appiumJSPath){
		
		 service = AppiumDriverLocalService.buildService(
					new AppiumServiceBuilder().usingDriverExecutable(new File(nodePath))
							.withAppiumJS(new File(appiumJSPath)));
//							.withIPAddress(Utility.GetValue("appium_ip_address"))
//							.usingPort(Utility.GetIntValue("appium_port"))
//							.withLogFile(new File(System.getProperty("user.dir")+"/ExecutionReports/Logs/appiumLogs.txt"))
//							.withArgument(GeneralServerFlag.LOG_LEVEL, "warn:debug")
//					        .withArgument(GeneralServerFlag.LOCAL_TIMEZONE));
			
		         	if(service.isRunning())
		      	{
				   service.stop();
				   service.start();
				
			   }
			       else
			   {
				service.start();
			   }
			    try {
			    	
					   LogUtil.infoLog(Utility.class,"**********Waiting for Appium to get started**********");
			    	
					 Thread.sleep(5000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			    
				   LogUtil.infoLog(Utility.class,"**********Appium started**********");
			
	}

	
	public static void androidCapabilities(String BrowserName)
	{
		capabilities.setCapability(MobileCapabilityType.BROWSER_NAME,"");
		capabilities.setCapability(MobileCapabilityType.DEVICE_NAME, Utility.GetValue("deviceName"));
		capabilities.setCapability(MobileCapabilityType.PLATFORM_VERSION, Utility.GetValue("platformVersion"));
		capabilities.setCapability(MobileCapabilityType.PLATFORM_NAME,Utility.GetValue("platformName"));
		capabilities.setCapability(MobileCapabilityType.AUTOMATION_NAME,Utility.GetValue("automationName"));
		capabilities.setCapability(MobileCapabilityType.UDID,Utility.GetValue("deviceID"));
		capabilities.setCapability(MobileCapabilityType.NEW_COMMAND_TIMEOUT,Utility.GetValue("newCommandTimeout"));
		
		if(BrowserName.isEmpty())
		{
			File app = new File(Utility.GetValue("apkFilePath"));
			capabilities.setCapability(MobileCapabilityType.APP, app.getAbsolutePath());
		}
	
	
	}
	

	public static void IOSCapabilities(String BrowserName){
		capabilities.setCapability(MobileCapabilityType.BROWSER_NAME, BrowserName);
		capabilities.setCapability(MobileCapabilityType.DEVICE_NAME,Utility.GetValue("ios_device_name"));
		capabilities.setCapability("launchTimeout",Utility.GetIntValue("launchTimeout"));
		capabilities.setCapability("platformName",Utility.GetValue("ios_platform_name"));
		capabilities.setCapability(MobileCapabilityType.AUTOMATION_NAME, AutomationName.IOS_XCUI_TEST);
		capabilities.setCapability(MobileCapabilityType.PLATFORM_VERSION, Utility.GetValue("ios_platform_version"));
		capabilities.setCapability("autoAcceptAlerts", true);
		if(Utility.GetValue("realDevice").equals("Y")){
			capabilities.setCapability(MobileCapabilityType.UDID, Utility.GetValue("ios_device_id"));
		}

		if(BrowserName.contains("Safari"))
		{
			capabilities.setCapability("safariAllowPopups", false);
			capabilities.setCapability("safariIgnoreFraudWarning", true);
		}

		else
		{
			File app = new File(Utility.GetValue("ipaFilePath"));
			capabilities.setCapability(MobileCapabilityType.APP, app.getAbsolutePath()); 
		}
	}
	
	


}
