data MatrixType = Array RowOrder 
				| Record RowOrder
data RowOrder = Single | RowCol | ColRow
	deriving (Show,Eq)

data Field = Field [Char] Type 
	deriving (Show,Eq)
data Type = Simple [Char] | Class [Char] [Field]
	deriving (Show,Eq)

generateField:: Field -> [Char]
generateField (Field name (Simple t)) = "public "++t++" "++name++";"
generateField (Field name (Class t f)) = generateField (Field name (Simple t))

generateClassDef (Simple _) = ""
generateClassDef (Class name fields) = generateName ++ generateSubDefs ++ generateFields ++ "\n}\n"
	where 
		f x y
			| not (hasNonTab x) = y
			| otherwise = x ++ "\n"++y
		--f x y = x ++"\n"++ y
		generateName = "class "++name++"\n{\n"
		generateFields = (foldl f "" (map ((tabLine 1).generateField) fields))
		generateSubDef (Field name t) = generateClassDef t
		generateSubDefs = foldr f "" (map generateSubDef fields)
		
hasNonTab [] = False
hasNonTab (x:xs) = if x == '\t' then hasNonTab xs else True
	
testClass = Class "test" ([Field ("row"++show x) (Simple "int")|x<-[0..9]]++[Field "innerClass" testInnerClass])
testInnerClass = (Class "InnerClass" [(Field "x" (Simple "int")),(Field "y" (Simple "int"))])

tabLine 0 x = x
tabLine i x = '\t':(tabLine (i-1) x)

condSwap x y True = y ++ x
condSwap x y False = x ++ y

--getAllFields n t x = foldr f "" $ map fieldWrapper $ recordFields n t x
--				where f x y = x ++ "\n" ++ y
				
--main = putStrLn $ getAllFields 2 "double" (Record ColRow)

--fieldWrapper x t = "public " ++ t ++ " " ++ x ++";"
--recordFields n t (Record Single) = ["Row" ++ show r ++ "Column" ++ show c | r <- [0..n], c<-[0..n]]
--recordFields n t (Record x) = [getRowOrderName x ++ show y | y<-[0..n]]

--getRowOrderName x = take 3 $ show x 
--field r c t n x = "public " ++ t ++ " " ++ fieldName r c n x
--fieldName r c n (Array x) = (if x == Single then ("Field"++ (show (r*n+c))) else ("Row" ++ show r ++ "Col" ++ show c))
--fieldName r c n (Record x) = "test"