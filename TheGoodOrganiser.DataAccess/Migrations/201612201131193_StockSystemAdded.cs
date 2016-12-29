namespace TheGoodOrganiser.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class StockSystemAdded : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.StockItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Amount = c.Int(nullable: false),
                        Type = c.Int(nullable: false),
                        ClothSize = c.Int(nullable: false),
                        ShoeSize = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.People", "PantsSize", c => c.Int(nullable: false));
            DropColumn("dbo.People", "Pants");
        }
        
        public override void Down()
        {
            AddColumn("dbo.People", "Pants", c => c.Int(nullable: false));
            DropColumn("dbo.People", "PantsSize");
            DropTable("dbo.StockItems");
        }
    }
}
