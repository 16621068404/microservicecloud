package com.springcloud.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
@SuppressWarnings("rawtypes")
public class PageUtil implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final int DEFAULT_PAGE_SIZE   = 10;
    private static final int DEFAULT_PAGE_COUNT  = 0;
    private static final int DEFAULT_TOTAL_COUNT = 0;
    private static final int DEFAULT_TOTAL_PAGE  = 0;

    private int              currentPage;             // 当前页
    private int              pageSize;                // 每页显示多少条记录
    private int              totalCount;              // 总记录数
    private int              totalPage;               // 总页数
    private int              tempVal;                 // 

	private int records;   // 总记录数
    
    private int total;     // 总页数
    
    private int page;      // 当前页
    
    private int row_num;   // 当前页记录数
    
	private String sord;   // 排序方式
	
	private String sidx;   // 要排序的字段
    
	private List rows;     //返回数据

	private String columnsearch;  //多条件搜索字段信息

	private String begindate;     //开始时间
	
	private String enddate;       //结束时间
	
	public String getBegindate() {
		return begindate;
	}

	public void setBegindate(String begindate) {
		this.begindate = begindate;
	}

	public String getEnddate() {
		return enddate;
	}

	public void setEnddate(String enddate) {
		this.enddate = enddate;
	}
	
	public String getColumnsearch() {
		return columnsearch;
	}

	public void setColumnsearch(String columnsearch) {
		this.columnsearch = columnsearch;
	}
    public List getRows() {
		return rows;
	}

	public void setRows(List rows) {
		this.rows = rows;
	}

	public String getSidx() {
		return sidx;
	}

	public void setSidx(String sidx) {
		this.sidx = sidx;
	}
    public String getSord() {
		return sord;
	}

	public void setSord(String sord) {
		this.sord = sord;
	}

    public int getRecords() {
		return records;
	}

	public void setRecords(int records) {
		this.records = records;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getRow_num() {
		return row_num;
	}

	public void setRow_num(int row_num) {
		this.row_num = row_num;
	}

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
