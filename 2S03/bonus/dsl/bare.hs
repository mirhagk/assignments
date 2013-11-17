
import Prelude hiding ((+),(*),(==))
import qualified Prelude as P
default (Int)
data Expr = Null
  | Const Int
  | Var [Char]
  | Add Expr Expr
  | Mult Expr Expr

class Mathable a where
	(+) :: (Mathable b) => a -> b -> Expr
	(*) :: (Mathable b) => a -> b -> Expr
	toPoly :: a-> Expr
	(==) :: (Mathable b) => a-> b-> Bool
	x + y = Add (toPoly x) (toPoly y)
	x * y = Mult (toPoly x) (toPoly y)
	x == y = eval (toPoly x) P.== eval (toPoly y)

instance Mathable Expr where
	toPoly x = x

instance Mathable Int where
	toPoly x = (Const x)
	
instance Mathable Integer where
	toPoly x = (Const (fromInteger x))
	
instance Mathable Double where
	toPoly x = (Const (floor x))

instance Mathable Char where
	toPoly x = (Var [x])
	
eval (Var x) = error "Cant' evaluate expressions with variables in them"
eval (Const x) = x
eval (Add p q) = eval p P.+ eval q
eval (Mult p (Const 0)) = 0
eval (Mult (Const 0) q) = 0
eval (Mult p q) = eval p P.* eval q
	
doStuff (Add x y) = "Addition"
doStuff _ = "Not addition"


--x = doStuff (1 + 2)