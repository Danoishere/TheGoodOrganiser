namespace TheGoodOrganiser.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LanguageAdded : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "Language", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Orders", "Language");
        }
    }
}
