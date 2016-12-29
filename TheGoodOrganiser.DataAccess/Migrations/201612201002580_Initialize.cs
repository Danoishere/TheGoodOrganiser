namespace TheGoodOrganiser.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initialize : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Orders",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CreatedOn = c.DateTime(nullable: false),
                        FinishedOn = c.DateTime(),
                        State = c.Int(nullable: false),
                        WhatsappNumber = c.String(),
                        WorkingPhoneNumber = c.String(),
                        ReceiverName = c.String(),
                        Camp = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.People",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FK_Order = c.Int(nullable: false),
                        Name = c.String(),
                        Gender = c.Int(nullable: false),
                        NeedsShoes = c.Boolean(nullable: false),
                        ShoeSize = c.Int(nullable: false),
                        NeedsPants = c.Boolean(nullable: false),
                        Pants = c.Int(nullable: false),
                        NeedsTop = c.Boolean(nullable: false),
                        TopSize = c.Int(nullable: false),
                        NeedsJacket = c.Boolean(nullable: false),
                        JacketSize = c.Int(nullable: false),
                        NeedsHygiene = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Orders", t => t.FK_Order, cascadeDelete: true)
                .Index(t => t.FK_Order);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.People", "FK_Order", "dbo.Orders");
            DropIndex("dbo.People", new[] { "FK_Order" });
            DropTable("dbo.People");
            DropTable("dbo.Orders");
        }
    }
}
