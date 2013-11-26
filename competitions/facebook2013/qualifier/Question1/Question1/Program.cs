using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Question1
{
    class Program
    {
        public static bool IsSquare(bool[,] image, int n)
        {
            int topX = -1;
            int topY = -1;
            for (int x = 0; x < n; x++)
            {
                for (int y = 0; y < n; y++)
                {
                    if (image[x, y])
                    {
                        topX = x;
                        topY = y;
                        break;
                    }
                }
                if (topX != -1)
                    break;
            }
            int w = -1;
            for (int x = topX; true; x++)
            {
                if (x==n||!image[x, topY])
                {
                    w = x - topX;
                    break;
                }
            }
            for(int x=topX;x<topX+w;x++)
            {
                for (int y = topY; y < topY + w; y++)
                {
                    if (!image[x, y])
                        return false;
                    image[x, y] = false;
                }
            }
            for (int x = 0; x < n; x++)
            {
                for (int y = 0; y < n; y++)
                {
                    if (image[x, y])
                        return false;
                }
            }
            return true;
        }
        static void Main(string[] args)
        {
            var reader = new System.IO.StreamReader("input.txt");
            var output = new System.IO.StreamWriter("output.txt");
            int t = int.Parse(reader.ReadLine());
            for (int i = 0; i < t; i++)
            {
                int n = int.Parse(reader.ReadLine());
                bool[,] image = new bool[n, n];
                for (int y = 0; y < n; y++)
                {
                    string line = reader.ReadLine();
                    for (int x = 0; x < n; x++)
                    {
                        image[x, y] = line[x] == '#';
                    }
                }
                output.WriteLine("Case #{0}: {1}", i + 1, IsSquare(image, n) ? "YES" : "NO");
            }
            reader.Close();
            output.Close();
        }
    }
}
