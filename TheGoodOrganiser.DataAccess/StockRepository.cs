using Alya.DataAccess;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheGoodOrganiser.Core;

namespace TheGoodOrganiser.DataAccess
{
    public class StockRepository : RepositoryBase<StockItem>
    {

        public async Task ModifyStock(int amount, StockItemType type, ClothSize clothSize, int shoeSize, Gender gender)
        {
            if(amount == 0)
            {
                return;
            }


            using (var context = new DataContext())
            {
                StockItem stock = null;
                if (type == StockItemType.Hygiene)
                {
                    stock = await context.RemainingStockItems.FirstOrDefaultAsync(i => i.Type == type && i.Gender == gender);
                }
                else if(type == StockItemType.Jacket || type == StockItemType.Pants || type == StockItemType.Top)
                {
                    stock = await context.RemainingStockItems.FirstOrDefaultAsync(i => i.Type == type && i.ClothSize == clothSize && i.Gender == gender);
                }
                else if(type == StockItemType.Shoes)
                {
                    stock = await context.RemainingStockItems.FirstOrDefaultAsync(i => i.Type == type && i.ShoeSize == shoeSize && i.Gender == gender);
                }

                if (stock == null)
                {
                    stock = new StockItem
                    {
                        Gender = gender,
                        Type = type,
                        ClothSize = clothSize,
                        ShoeSize = shoeSize,
                        Amount = amount,
                    };
                    context.RemainingStockItems.Add(stock);
                }
                else
                {
                    stock.Amount = stock.Amount + amount;
                }

                if(stock.Amount <= 0)
                {
                    context.RemainingStockItems.Remove(stock);
                }

                await context.SaveChangesAsync();
            }
        }


        public async Task AddShoesToStock(int amount, int size, Gender gender)
        {
            using(var context = new DataContext())
            {
                var stock = await context.RemainingStockItems.FirstOrDefaultAsync(i => i.ShoeSize == size && i.Type == StockItemType.Shoes);
                if (stock == null)
                {
                    stock = new StockItem
                    {
                        Gender = gender,
                        Type = StockItemType.Shoes,
                        ShoeSize = size,
                        Amount = amount,
                    };
                    context.RemainingStockItems.Add(stock);
                }
                else
                {
                    stock.Amount = stock.Amount + amount;
                }
                
                await context.SaveChangesAsync();
            }
        }

        public async Task AddClothsToStock(int amount, StockItemType type, ClothSize size, Gender gender)
        {
            using (var context = new DataContext())
            {
                var stock = await context.RemainingStockItems.FirstOrDefaultAsync(i => i.ClothSize == size && i.Type == type);
                if (stock == null)
                {
                    stock = new StockItem
                    {
                        Gender = gender,
                        Type = type,
                        ClothSize = size,
                        Amount = amount,
                    };
                    context.RemainingStockItems.Add(stock);
                }
                else
                {
                    stock.Amount = stock.Amount + amount;
                }

                await context.SaveChangesAsync();
            }
        }
        public async Task AddHygieneToStock(int amount)
        {
            using (var context = new DataContext())
            {
                var stock = await context.RemainingStockItems.FirstOrDefaultAsync(i => i.Type == StockItemType.Hygiene);
                if (stock == null)
                {
                    stock = new StockItem
                    {
                        Type = StockItemType.Hygiene,
                        Amount = amount,
                    };
                    context.RemainingStockItems.Add(stock);
                }
                else
                {
                    stock.Amount = stock.Amount + amount;
                }

                await context.SaveChangesAsync();
            }
        }


        public async Task UsePersonOrderItems(DataContext context, PersonNeed personOrder)
        {
            if (personOrder.NeedsShoes)
            {
                await UseShoes(context, personOrder.ShoeSize);
            }
            if (personOrder.NeedsPants)
            {
                await UseCloth(context, personOrder.PantsSize, StockItemType.Pants);
            }
            if (personOrder.NeedsTop)
            {
                await UseCloth(context, personOrder.TopSize, StockItemType.Top);
            }
            if (personOrder.NeedsJacket)
            {
                await UseCloth(context, personOrder.JacketSize, StockItemType.Jacket);
            }
            if (personOrder.NeedsHygiene)
            {
                await UseHygiene(context);
            }
            
        }

        public async Task<bool> CheckAvailabilityFor(DataContext context, PersonNeed personOrder)
        {
            
            if (personOrder.NeedsShoes)
            {
               var result = await CheckShoes(context, personOrder.ShoeSize);
                if (!result)
                    return false;
            }
            if (personOrder.NeedsPants)
            {
                var result = await CheckCloth(context, personOrder.PantsSize, StockItemType.Pants);
                if (!result)
                    return false;
            }
            if (personOrder.NeedsTop)
            {
                var result = await CheckCloth(context, personOrder.TopSize, StockItemType.Top);
                if (!result)
                    return false;
            }
            if (personOrder.NeedsJacket)
            {
                var result = await CheckCloth(context, personOrder.JacketSize, StockItemType.Jacket);
                if (!result)
                    return false;
            }
            if (personOrder.NeedsHygiene)
            {
                var result = await CheckHygiene(context);
                if (!result)
                    return false;
            }
            return true;
        }

        public async Task UseShoes(DataContext context, int size)
        {
                var shoeStock = await context.RemainingStockItems.FirstOrDefaultAsync(s => s.Type == StockItemType.Shoes && s.ShoeSize == size);
                if (shoeStock.Amount > 0)
                {
                    shoeStock.Amount = shoeStock.Amount - 1;
                    UpdateWithoutSaving(context, shoeStock);
                }
                else
                {
                    throw new Exception("Not enough shoes available");
                }
        }

        public async Task<bool> CheckShoes(DataContext context, int size)
        {
            var shoeStock = await context.RemainingStockItems.FirstOrDefaultAsync(s => s.Type == StockItemType.Shoes && s.ShoeSize == size);
            if (shoeStock.Amount > 0)
            {
                return true;
            }
            return false;
        }

        public async Task UseCloth(DataContext context, ClothSize size, StockItemType type)
        {

            var clothStock = await context.RemainingStockItems.FirstOrDefaultAsync(s => s.Type == type && s.ClothSize == size);
            if (clothStock.Amount > 0)
            {
                clothStock.Amount = clothStock.Amount - 1;
                UpdateWithoutSaving(context, clothStock);
            }
            else
            {
                throw new Exception("Not enough " + type + " available");
            }
        }

        public async Task<bool> CheckCloth(DataContext context, ClothSize size, StockItemType type)
        {

            var clothStock = await context.RemainingStockItems.FirstOrDefaultAsync(s => s.Type == type && s.ClothSize == size);
            if (clothStock.Amount > 0)
            {
                return true;
            }
            return false;
        }

        public async Task UseHygiene(DataContext context)
        {
                var hygieneStock = await context.RemainingStockItems.FirstOrDefaultAsync(s => s.Type == StockItemType.Hygiene);
                if (hygieneStock.Amount > 0)
                {
                    hygieneStock.Amount = hygieneStock.Amount - 1;
                    UpdateWithoutSaving(context, hygieneStock);
                }
                else
                {
                    throw new Exception("Not enough hygiene available");
                }
        }

        public async Task<bool> CheckHygiene(DataContext context)
        {
            var hygieneStock = await context.RemainingStockItems.FirstOrDefaultAsync(s => s.Type == StockItemType.Hygiene);
            if (hygieneStock.Amount > 0)
            {
                return true;
            }
            return false;
        }

        public void UpdateWithoutSaving(DataContext context, object entry)
        {
            context.Entry(entry).State = EntityState.Modified;
        }
    }
}
