abstract class DB{
    protected client: any;
    
    abstract findOneRecord(queryParams: any): any;  
    abstract writeRecord(data: any): Promise<boolean>;
}

export default DB;