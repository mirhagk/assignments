--data Matrix = Matrix Row1Col1 Row1Col2 Row1Col3 Row2Col1 Row2Col2 Row2Col3 Row3Col1 Row3Col2 Row3Col3

--determinant (Matrix r1c1 r1c2 r1c3 r2c1 r2c2 r2c3 r3c1 r3c2 r3c3) = r1c1 * (r2c2 *r3c3 - r2c3 * r3c2) * r1c2

--r1c1 r1c2 r1c3 
--r2c1 r2c2 r2c3 
--r3c1 r3c2 r3c3

data Expr = Const Int
		| Mult Expr Expr
		| Add Expr Expr
		| Var [Char]
		deriving (Show)

codeDet n = codeDetIn 1 0 1 n True


makeField:: Int -> Int -> Expr
makeField r c = Var ("r"++ show r ++ "c"++ show c)
codeDetIn ro co _ 1 _ = makeField ro co
codeDetIn ro co i n s = if (i>n) then (Const 0) else Add inner (codeDetIn ro co (i+1) n (not s))
		where field = makeField ro (co+i)
		      inner = Mult field (codeDetIn (ro+1) (co+1) (1) (n-1) True)
			
codeSum :: [Expr] -> Expr			
codeSum (x:[]) = x
codeSum (x:xs) = Add x (codeSum xs)
codeDetMat :: [[[Char]]] -> Expr
codeDetMat m = if (length m == 1) then Var (m!!0!!0) else codeSum [ neg (term x) x | x <-[0..(length m)-1]]
	where neg x i = if mod i 2 == 0 then x else Mult x (Const (-1))
	      term x = Mult (Var (m!!0!!x)) (codeDetMat (subMatrix m 0 x))
			  
createMatField n = [[ "r" ++ show r ++ "c" ++ show c | c <- [1..n]] | r<-[1..n]]

astToEquation (Const x) = show x
astToEquation (Var x) = x
astToEquation (Add x y) = astToEquation_doOp x y "+"
astToEquation (Mult x y) = astToEquation_doOp x y "*"

astToEquation_doOp x y op = "(" ++ astToEquation x ++ ") " ++ op ++ " (" ++ astToEquation y ++ ")"


prettyPrint p = case (simplify p) of
				(Mult (Const c) (Var x)) -> show c ++ x
				(Const c) -> show c
				(Var x) -> x
				(Add x y) -> "(" ++ (prettyPrint x) ++ ") + (" ++ (prettyPrint y) ++ ")"
				(Mult x y) -> "(" ++ (prettyPrint x) ++ ") * (" ++ (prettyPrint y) ++ ")"


simplify :: Expr -> Expr
simplify (Add p q) = case (simplify p, simplify q) of
                          (Const 0, x) -> x
                          (x, Const 0) -> x
                          (Const pc, Const qc) -> Const (pc + qc)
                          (Var pv, Var qv) -> if pv == qv then simplify (Mult (Var pv) (Const 2)) else Add (Var pv) (Var qv)
                          (Const pc, Add (Const qc) notConst) -> Add (Const (pc + qc)) notConst
                          (pNonConst, Add (Const qc) qNonConst) -> Add (Const qc) (Add pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Add (Const qc) nonConst
                          (pNonConst, qNonConst) -> Add pNonConst qNonConst
simplify (Mult p q) = case (simplify p, simplify q) of
                          (Const 0, _) -> Const 0
                          (_, Const 0) -> Const 0
                          (Const 1, x) -> x
                          (x, Const 1) -> x
                          (Const pc, Const qc) -> Const (pc * qc)
                          (Const pc, Mult (Const qc) notConst) -> Mult (Const (pc * qc)) notConst
                          (pNonConst, Mult (Const qc) qNonConst) -> Mult (Const qc) (Mult pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Mult (Const qc) nonConst
                          (pNonConst, qNonConst) -> Mult pNonConst qNonConst
simplify p = p

		
testMatrices = [
				[					
					[6,1,1],
					[4,-2,5],
					[2,8,7]
				],
				[
					[4,6],
					[3,8]
				]
				]
testDeterminants = [-306,14]
isSquare x = (length x) == (length $ x!!0)

subMatrix m rr cr = [[ m !!r!!c | c <-[0.. (length (m!!r)) - 1], c /= cr] | r<-[0..(length m)-1], r/=rr]

determinant m = if (length m == 1) then m!!0!!0 else sum [ neg (term x) x | x <- [0..(length m)-1]]
	where neg x i = if mod i 2 == 0 then x else -x
	      term x = (m!!0!!x) * determinant (subMatrix m 0 x)