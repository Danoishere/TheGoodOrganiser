using Alya.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheGoodOrganiser.Core;

namespace TheGoodOrganiser.DataAccess
{
    public class PersonNeedRepository : RepositoryBase<PersonNeed>
    {
        public async Task Add(int orderId, PersonNeed personNeed)
        {
            using (var context = new DataContext())
            {
                personNeed.FK_Order = orderId;
                context.PersonNeeds.Add(personNeed);
                await context.SaveChangesAsync();
            }
        }

    }
}
