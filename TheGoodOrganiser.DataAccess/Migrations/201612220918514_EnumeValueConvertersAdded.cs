namespace TheGoodOrganiser.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EnumeValueConvertersAdded : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.StockItems", "Gender", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.StockItems", "Gender");
        }
    }
}
