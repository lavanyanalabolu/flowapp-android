package Utilities;


public class TestResults  extends Utility{
	
	private String dateOfExecution,resultStatus, reasonForFailure, failedScreenShotReference;
	private long totalTimeTaken;
	
	 
	public String getDateOfExecution() {
		return dateOfExecution;
	}
	public void setDateOfExecution(String dateOfExecution) {
		this.dateOfExecution = dateOfExecution;
	}
	
	public String getResultStatus() {
		return resultStatus;
	}
	public void setResultStatus(String resultStatus) {
		this.resultStatus = resultStatus.toUpperCase();
	}
	public long getTotalTimeTaken() {
		return totalTimeTaken;
	}
	public void setTotalTimeTaken(long totalTimeTaken) {
		this.totalTimeTaken = totalTimeTaken;
	}
	public String getReasonForFailure() {
		return reasonForFailure;
	}
	public void setReasonForFailure(String reasonForFailure) {
		this.reasonForFailure = reasonForFailure;
	}
	public String getFailedScreenShotReference() {
		return failedScreenShotReference;
	}
	public void setFailedScreenShotReference(String failedScreenShotReference) {
		this.failedScreenShotReference = failedScreenShotReference;
	}
	
	
	
	
	

}
