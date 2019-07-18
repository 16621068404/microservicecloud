package com.springcloud.entity;

public class PageUtil {
    private static final int DEFAULT_PAGE_SIZE   = 10;
    private static final int DEFAULT_PAGE_COUNT  = 0;
    private static final int DEFAULT_TOTAL_COUNT = 0;
    private static final int DEFAULT_TOTAL_PAGE  = 0;

    private int              currentPage;             // 当前页
    private int              pageSize;                // 每页显示多少条记录
    private int              totalCount;              // 总记录数
    private int              totalPage;               // 总页数
    private int              tempVal;                 // 
    
    
    
    public int getTempVal() {
		return tempVal;
	}

	public void setTempVal(int tempVal) {
		this.tempVal = tempVal;
	}

	public PageUtil(int currentPage) {
        this.currentPage = currentPage;
        setPageSize(DEFAULT_PAGE_SIZE);
    }

    public PageUtil() {
        setCurrentPage(DEFAULT_PAGE_COUNT);
        setPageSize(DEFAULT_PAGE_SIZE);
        setTotalCount(DEFAULT_TOTAL_COUNT);
        setTotalPage(DEFAULT_TOTAL_PAGE);
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }

    public static int getDefaultPageSize() {
        return DEFAULT_PAGE_SIZE;
    }
}
