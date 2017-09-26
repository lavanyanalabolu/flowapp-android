package Utilities;
import java.util.ArrayList;
import java.util.List;

	
	

	/**
	 * @author TX
	 */
public class TestConfig {
		private String suiteName; 
		private String browserName;
		private String suiteId;
		private String PlatformName;
		private List<String> testsList = new ArrayList<String>();

		/**
		 * 
		 */
		public TestConfig() {
			super();
		}

		/**
		 * @param suiteName
		 * @param browserName
		 * @param suiteId
		 * @param testsList
		 */
		public TestConfig(String suiteName, String PlatformName, String suiteId, List<String> testsList) {
			super();
			this.suiteName = suiteName;
			this.browserName = browserName;
			this.suiteId = suiteId;
			this.testsList = testsList;
			this.PlatformName=PlatformName;
		}

		/**
		 * @return
		 */
		public String getSuiteName() {
			return suiteName;
		}

		/**
		 * @param suiteName
		 */
		public void setSuiteName(String suiteName) {
			this.suiteName = suiteName;
		}

		/**
		 * @return
		 */
		public String getBrowserName() {
			return browserName;
		}

		/**
		 * @param browserName
		 */
		public void setBrowserName(String browserName) {
			this.browserName = browserName;
		}

		/**
		 * @return
		 */
		public String getPlatformName() {
			return PlatformName;
		}

		/**
		 * @param browserName
		 */
		public void setPlatformName(String PlatformName) {
			this.PlatformName = PlatformName;
		}

		/**
		 * @return
		 */
		public String getSuiteId() {
			return suiteId;
		}

		/**
		 * @param suiteId
		 */
		public void setSuiteId(String suiteId) {
			this.suiteId = suiteId;
		}

		/**
		 * @return
		 */
		public List<String> getTestsList() {
			return testsList;
		}

		/**
		 * @param testsList
		 */
		public void setTestsList(List<String> testsList) {
			this.testsList = testsList;
		}

	}



