namespace TheGoodOrganiser.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NameChanges : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.People", newName: "PersonNeeds");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.PersonNeeds", newName: "People");
        }
    }
}
