namespace TheGoodOrganiser.DataAccess.Migrations
{
    using Core;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<TheGoodOrganiser.DataAccess.DataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(TheGoodOrganiser.DataAccess.DataContext context)
        {
            base.Seed(context);

            /**
            using(var sr = new StockRepository())
            {
                await sr.AddClothsToStock(13, StockItemType.Pants, ClothSize.L);
                await sr.AddClothsToStock(5, StockItemType.Pants, ClothSize.L);

                await sr.AddClothsToStock(5, StockItemType.Jacket, ClothSize.L);
                await sr.AddClothsToStock(63, StockItemType.Top, ClothSize.L);
                await sr.AddClothsToStock(3, StockItemType.Jacket, ClothSize.M);
                await sr.AddClothsToStock(5, StockItemType.Pants, ClothSize.XL);

                await sr.AddHygieneToStock(5);

                await sr.AddShoesToStock(45,35);
                await sr.AddShoesToStock(43, 40);
            }
    **/
        }
    }
}
