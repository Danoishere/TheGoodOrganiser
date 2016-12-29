namespace TheGoodOrganiser.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RefCodeAdded : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "ReferenceCode", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Orders", "ReferenceCode");
        }
    }
}
