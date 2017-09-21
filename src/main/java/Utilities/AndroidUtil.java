package Utilities;

import java.util.HashMap;
import java.util.Map;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;

public class AndroidUtil extends Utility {

	public static Dimension size;
	public static String[] activityName, apkInfo;
	public static String appVersionCode, appVersionName, appActivity, appPackage;
	public static Map<String, String> apkInfoMap = new HashMap<String, String>();

	@SuppressWarnings("rawtypes")
	public static Boolean swipeVerticalBottom() throws InterruptedException {
		Boolean flag = false;
		
		size = driver.manage().window().getSize();
		int starty = (int) (size.height * 0.50);
		int endy = (int) (size.height * 0.10);
		int startx = size.width / 2;
		((AndroidDriver) driver).swipe(startx, starty, startx, endy, 3000);
		Thread.sleep(2000);
		flag = true;

		if (flag)
			return true;
		else
			return false;
	}

	public static Boolean swipeVerticalBottom1() throws InterruptedException {
		Boolean flag = false;
		size = driver.manage().window().getSize();
		int starty = (int) (size.height * 0.50);
		int endy = (int) (size.height * 0.50);
		int startx = size.width / 2;
		((AppiumDriver) driver).swipe(startx, starty, startx, endy, 3000);
		Thread.sleep(2000);
		flag = true;

		if (flag)
			return true;
		else
			return false;
	}

	@SuppressWarnings("rawtypes")
	public static Boolean swipeHorizontal() throws InterruptedException {
		Boolean flag = false;
		size = driver.manage().window().getSize();
		int startx = (int) (size.width * 0.90);
		int endx = (int) (size.height * 0.05);
		int starty = size.width / 2;
		((AppiumDriver) driver).swipe(startx, starty, endx, starty, 3000);
		Thread.sleep(2000);
		flag = true;

		if (flag)
			return true;
		else
			return false;
	}
	
	@SuppressWarnings("rawtypes")
	public static Boolean swipeHorizontalForFlow() throws InterruptedException {
		Boolean flag = false;
		size = driver.manage().window().getSize();
		int startx = (int) (size.width * 0.90);
		int endx = (int) (size.height * 0.05);
		int starty = size.width / 2;
		((AppiumDriver) driver).swipe(320, 574, 836, 574, 3000);
		Thread.sleep(2000);
		flag = true;

		if (flag)
			return true;
		else
			return false;
	}
	
	
	@SuppressWarnings("rawtypes")
	public static Boolean swipeHorizontalleft() throws InterruptedException {
		Boolean flag = false;
		size = driver.manage().window().getSize();
		int startx = (int) (size.width * 0.90);
		int endx = (int) (size.height * 0.05);
		int starty = size.width / 2;
		((AppiumDriver) driver).swipe(320, 537, 688, 799, 3000);
		Thread.sleep(2000);
		flag = true;

		if (flag)
			return true;
		else
			return false;
	}

	@SuppressWarnings("rawtypes")
	public static Boolean swipeVerticalTop() throws InterruptedException {
		Boolean flag = false;
		size = driver.manage().window().getSize();
		int starty = (int) (size.height * 0.90);
		int endy = (int) (size.height * 0.30);
		int startx = size.width / 2;
		((AppiumDriver) driver).swipe(startx, endy, startx, starty, 3000);
		Thread.sleep(2000);
		flag = true;

		if (flag)
			return true;
		else
			return false;
	}

	public static Boolean tap(double x, double y) throws InterruptedException {

		Boolean flag = false;
		JavascriptExecutor js = (JavascriptExecutor) driver;
		double x1 = x;
		double y1 = y;
		HashMap<String, Double> point = new HashMap<String, Double>();
		point.put("x", x1);
		point.put("y", y1);
		js.executeScript("mobile: tap", point);
		flag = true;

		if (flag)
			return true;
		else
			return false;
	}

	public static void moveToContext(String contextName) {
		if (contextName.contains("NATIVE")) {
			driver.context("NATIVE_APP");
		}

		else if (contextName.contains("WEBVIEW")) {
			driver.context("WEBVIEW_1");
		}

	}

	public static void relaunchApp(String packageName) {
		try {
			driver.closeApp();
			Thread.sleep(1000);
			Runtime.getRuntime().exec("adb shell monkey -p " + packageName + " -c android.intent.category.LAUNCHER 1");

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void click(By by) throws InterruptedException {
		Thread.sleep(2000);
		driver.findElement(by).click();
	}

	public void sendKeys(By by, String data) throws InterruptedException {
		Thread.sleep(2000);
		driver.findElement(by).sendKeys(data);
	}

	public boolean hasElement(By by) throws InterruptedException {
		Thread.sleep(2000);
		return driver.findElement(by).isDisplayed();
	}

	public static Boolean startActivity(String packageName, String appActivity) {
		Boolean flag = false;
		((AndroidDriver) driver).startActivity(packageName, appActivity);
		flag = true;
		return flag;
	}

	public static Boolean resetApp() {
		Boolean flag = false;
		driver.resetApp();
		flag = true;
		return flag;
	}

}
