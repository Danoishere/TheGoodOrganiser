using Alya.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using TheGoodOrganiser.Core;

namespace TheGoodOrganiser.DataAccess
{
    public class DataContext : AlyaDbContextBase
    {
        public const string ContextName = "Default";

        public DataContext() : base(ContextName)
        {
            
        }
        public DataContext(string contextName) : base(contextName)
        {

        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<PersonNeed> PersonNeeds { get; set; }
        public DbSet<StockItem> RemainingStockItems { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>()
                .HasMany(o => o.PersonNeeds)
                .WithRequired(p => p.Order)
                .HasForeignKey(p => p.FK_Order);
        }
    }
}
