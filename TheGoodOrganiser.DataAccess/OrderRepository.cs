using Alya.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;
using System.Threading.Tasks;
using TheGoodOrganiser.Core;

namespace TheGoodOrganiser.DataAccess
{
    public class OrderRepository : RepositoryBase<Order>
    {
        public async Task MarkOrderAsReadyAndTakeFromStock(int orderId)
        {
            using (var context = new DataContext())
            {
                var order = await context.Orders.Include(o => o.PersonNeeds).FirstOrDefaultAsync(o => o.Id == orderId);

                try
                {
                    using (var stockRepository = new StockRepository())
                    {
                        foreach (var orderForPerson in order.PersonNeeds)
                        {
                            await stockRepository.UsePersonOrderItems(context, orderForPerson);
                        }
                    }
                    order.State = OrderState.Ready;

                    await Update(order);
                    await context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    // Gets thrown in case, any item isnt available anymore. Data will be rolled back
                    throw e;
                }
            }
        }

        public async Task<bool> CheckAvailability(int orderId)
        {
            using (var context = new DataContext())
            {
                var order = await context.Orders.Include(o => o.PersonNeeds).FirstOrDefaultAsync(o => o.Id == orderId);

                try
                {
                    using (var stockRepository = new StockRepository())
                    {
                        foreach (var orderForPerson in order.PersonNeeds)
                        {
                            var result = await stockRepository.CheckAvailabilityFor(context, orderForPerson);
                            if (!result)
                            {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                catch (Exception e)
                {
                    return false;
                }
            }
        }
    }
}
