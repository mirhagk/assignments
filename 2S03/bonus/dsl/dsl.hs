--NOT FOR ASSIGNMENT FOR THE LOLZ
module Assign2 where

import CPU

import Prelude hiding ((+),(*),(==))
import qualified Prelude as P

data Expr = Null
  | Const Int
  | Var [Char]
  | Addition Expr Expr
  | Mult Expr Expr

class Mathable a where
	(+) :: (Mathable b) => a -> b -> Expr
	(*) :: (Mathable b) => a -> b -> Expr
	toPoly :: a-> Expr
	(==) :: (Mathable b) => a-> b-> Bool
	x + y = Addition (toPoly x) (toPoly y)
	x * y = Mult (toPoly x) (toPoly y)
	x == y = eval (toPoly x) P.== eval (toPoly y)
--
--instance Eq Expr where
--	x == y = x `polyEqual` y

instance Mathable Expr where
	toPoly x = x

instance Mathable Int where
	toPoly x = (Const x)
	
--instance Mathable Integer where
--	toPoly x = (Const (fromInteger x))
	
instance Mathable Double where
	toPoly x = (Const (floor x))

instance Mathable Char where
	toPoly x = (Var [x])

--instance  Read Expr  where
--	readsPrec _ s = [(Var s, "")]
instance Show Expr where
	show = printPoly

infixl 7 *
infixl 6 +
	
--printPoly $ simplify $ diff (1 + 2 + 3 * (Var "x") * (Var "x") * (Var "y")) "x"
polyEqual x y = eval x == eval y

collectConstants :: Expr -> Expr
collectConstants (Addition p q) = case (collectConstants p, collectConstants q) of
                          (Const pc, Const qc) -> Const (pc P.+ qc)
                          (Const pc, Addition (Const qc) notConst) -> Addition (Const (pc P.+ qc)) notConst
                          (pNonConst, Addition (Const qc) qNonConst) -> Addition (Const qc) (Addition pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Addition (Const qc) nonConst
                          (pNonConst, qNonConst) -> Addition pNonConst qNonConst
collectConstants (Mult p q) = case (collectConstants p, collectConstants q) of
                          (Const pc, Const qc) -> Const (pc P.* qc)
                          (Const pc, Mult (Const qc) notConst) -> Mult (Const (pc P.* qc)) notConst
                          (pNonConst, Mult (Const qc) qNonConst) -> Mult (Const qc) (Mult pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Mult (Const qc) nonConst
                          (pNonConst, qNonConst) -> Mult pNonConst qNonConst
-- can't do anything with constants and variables
collectConstants x = x


-- we still need to print the answer
printPoly :: Expr -> String
printPoly (Const c) = show c
printPoly (Var v) = v -- turn a single Char into a String=[Char]
printPoly (Addition p q) = "(" ++ (printPoly p) ++ ") + (" ++ (printPoly q) ++ ")"
printPoly (Mult p q) = "(" ++ (printPoly p) ++ ") * (" ++ (printPoly q) ++ ")"

prettyPrint p = case (simplify p) of
				(Mult (Const c) (Var x)) -> show c ++ x
				(Const c) -> show c
				(Var x) -> x
				(Addition x y) -> "(" ++ (prettyPrint x) ++ ") + (" ++ (prettyPrint y) ++ ")"
				(Mult x y) -> "(" ++ (prettyPrint x) ++ ") * (" ++ (prettyPrint y) ++ ")"

--replace :: Char -> Double -> Expr -> Expr
replace x y (Var v) = if v P.== x then (Const y) else (Var v)
replace x y (Addition p q) = Addition (replace x y p) (replace x y q)
replace x y (Mult p q) = Mult (replace x y p) (replace x y q)
replace x y p = p

eval (Var x) = error "Cant' evaluate expressions with variables in them"
eval (Const x) = x
eval (Addition p q) = eval p P.+ eval q
eval (Mult p (Const 0)) = 0
eval (Mult (Const 0) q) = 0
eval (Mult p q) = eval p P.* eval q


simplify :: Expr -> Expr
simplify (Addition p q) = case (simplify p, simplify q) of
                          (Const 0, x) -> x
                          (x, Const 0) -> x
                          (Const pc, Const qc) -> Const (pc P.+ qc)
                          (Var pv, Var qv) -> if pv P.== qv then simplify (Mult (Var pv) (Const 2)) else Addition (Var pv) (Var qv)
                          (Const pc, Addition (Const qc) notConst) -> Addition (Const (pc P.+ qc)) notConst
                          (pNonConst, Addition (Const qc) qNonConst) -> Addition (Const qc) (Addition pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Addition (Const qc) nonConst
                          (pNonConst, qNonConst) -> Addition pNonConst qNonConst
simplify (Mult p q) = case (simplify p, simplify q) of
                          (Const 0, _) -> Const 0
                          (_, Const 0) -> Const 0
                          (Const 1, x) -> x
                          (x, Const 1) -> x
                          (Const pc, Const qc) -> Const (pc P.* qc)
                          (Const pc, Mult (Const qc) notConst) -> Mult (Const (pc P.* qc)) notConst
                          (pNonConst, Mult (Const qc) qNonConst) -> Mult (Const qc) (Mult pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Mult (Const qc) nonConst
                          (pNonConst, qNonConst) -> Mult pNonConst qNonConst
simplify p = p

diff (Const x) dx =  Const 0
diff (Var x) dx = if (x P.== dx) then Const 1 else (Var x)
diff (Addition x y) dx = Addition (diff x dx) (diff y dx)
diff (Mult x y)dx  = Addition (Mult (diff x dx) (y)) (Mult (x) (diff y dx))

--((((((((1.0) + (2.0)) + (3.0)) * (1.0))) *
--(x)) + (((((1.0) + (2.0)) + (3.0)) * (x)) * (1.0))) * (y)) + ((((((1.0) + (2.0))
-- + (3.0)) * (x)) * (x)) * (y))"

d p v x = eval $ replace v x (simplify (diff p v))

--inCircle::Int->(Float,Float)->(Float,Float)->Bool
inCircle radius (cx,cy) (x,y) = (x-cx)^2 P.+ (y-cy)^2 <= radius^2

draw f = putStrLn $ unlines {-put the lines together and output them-} $ [ [ if f (x,y) then '*' else ' ' | x <- [-30..30]]| y <- reverse [-19..19]]

inCircles radius [] p = False
inCircles radius (x:xs) p = inCircle radius x p || inCircles radius xs p

drawUnion list = draw (inCircles 7.5 list)

{-

data Expr = Const Int
	| Var String
	| Addition Expr Expr
	| Mult Expr Expr
	deriving (Show)


printPoly :: Expr -> String
printPoly (Const c) = show c
printPoly (Var v) = v -- turn a single Char into a String=[Char]
printPoly (Addition p q) = "(" ++ (printPoly p) ++ ") + (" ++ (printPoly q) ++ ")"
printPoly (Mult p q) = "(" ++ (printPoly p) ++ ") * (" ++ (printPoly q) ++ ")"
-}
	
polyX :: [Int] -> Expr
polyX coeffs = polyHelper $ map Const $ reverse coeffs

polyHelper :: [Expr] -> Expr
polyHelper [x] = x
polyHelper (x:xs) = (Addition x (Mult (Var "x") (polyHelper xs)))
	
{-data Instr = LoadImmediate RegisterNumber -- put value here
						RegisterValue -- the value
			| Add RegisterNumber -- put result here
						RegisterNumber -- first thing to add
						RegisterNumber -- second thing to multiply
			| Multiply RegisterNumber -- put result here
						RegisterNumber -- first thing to multiply
						RegisterNumber -- second thing to multiply
						
						deriving (Show)
	-}

expr2Code :: Expr -> [Instruction]
expr2Code expr = e2C 1 expr

--e2c basically each call to e2c gives an expression and a number. The number is the register where the result must be in at the end of the calculation
e2C reg (Const x) = [LoadImmediate reg x]
e2C reg (Addition (Const x) y) = (e2C reg y)++(e2C 3 (Const x))++[Add reg reg 3]
e2C reg (Mult (Var "x") y) = (e2C reg y)++[Multiply reg reg 2]

instruct2Code::Integer->[Instruction]->Code
instruct2Code n [] = []
instruct2Code n (x:xs) = (n,x):(instruct2Code (n P.+1) xs)

expr2CodeStack::Int->Expr->Code
expr2CodeStack x expr = instruct2Code 0 ([LoadImmediate 2 x, LoadImmediate 8 (0), LoadImmediate 7 (-1), LoadImmediate 6 1]++(e2CS expr)++[Load 1 8 0, Halt])
--6 is 1, 7 is -1
e2CS (Const x) = [LoadImmediate 3 x, Add 8 8 6, Store 3 8 0]
e2CS (Var "x") = [Add 8 8 6, Store 2 8 0]
e2CS (Addition x y) = (e2CS x)++(e2CS y)++[Load 3 8 0, Load 4 8 7, Add 3 3 4, Store 3 8 7, Add 8 8 7]
e2CS (Mult x y) = (e2CS x)++(e2CS y)++[Load 3 8 0, Load 4 8 7, Multiply 3 3 4, Store 3 8 7, Add 8 8 7]
--e2CS (Mult x y) = (e2CS x)++(e2CS y)++[Add 8 8 7, Add 8 8 7, Load 3 8 0, Load 4 8 6, Multiply 3 3 4, Store 3 8 0]

code::Code
code = expr2CodeStack 3 $ polyX [1..15]

--code = expr2CodeStack 0 (1+ 2)
--main = putStrLn $ printPoly $ (Const 1) + (Const 2)